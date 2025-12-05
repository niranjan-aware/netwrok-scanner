package com.security.scanner.service;

import com.security.scanner.config.ScannerConfig;
import com.security.scanner.dto.ScanRequest;
import com.security.scanner.dto.ScanResponse;
import com.security.scanner.exception.ResourceNotFoundException;
import com.security.scanner.model.PortResult;
import com.security.scanner.model.ScanJob;
import com.security.scanner.repository.ScanJobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScanJobService {
    
    private final ScanJobRepository scanJobRepository;
    private final PortScannerService portScanner;
    private final ScannerConfig config;
    
    @Transactional
    public ScanResponse createScanJob(ScanRequest request) {
        List<Integer> ports = parsePorts(request.getPortRange());
        
        ScanJob job = ScanJob.builder()
                .target(request.getTarget())
                .portRange(request.getPortRange())
                .status(ScanJob.ScanStatus.PENDING)
                .progress(0)
                .totalPorts(ports.size())
                .scannedPorts(0)
                .openPorts(0)
                .closedPorts(0)
                .filteredPorts(0)
                .build();
        
        job = scanJobRepository.save(job);
        
        // Start scan asynchronously
        executeScan(job.getId(), request.getTarget(), ports);
        
        return mapToResponse(job);
    }
    
    @Async("virtualThreadExecutor")
    public void executeScan(Long jobId, String target, List<Integer> ports) {
        ScanJob job = scanJobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Scan job not found"));
        
        try {
            job.setStatus(ScanJob.ScanStatus.RUNNING);
            scanJobRepository.save(job);
            
            log.info("Starting scan for job {} - Target: {}, Ports: {}", jobId, target, ports.size());
            
            // Scan all ports (including closed and filtered)
            List<PortResult> results = portScanner.scanPorts(target, ports);
            
            // Associate results with job
            results.forEach(result -> result.setScanJob(job));
            job.setResults(results);
            job.setScannedPorts(ports.size());
            
            // Count by status
            long openCount = results.stream()
                    .filter(r -> r.getStatus() == PortResult.PortStatus.OPEN)
                    .count();
            long closedCount = results.stream()
                    .filter(r -> r.getStatus() == PortResult.PortStatus.CLOSED)
                    .count();
            long filteredCount = results.stream()
                    .filter(r -> r.getStatus() == PortResult.PortStatus.FILTERED)
                    .count();
            
            job.setOpenPorts((int) openCount);
            job.setClosedPorts((int) closedCount);
            job.setFilteredPorts((int) filteredCount);
            job.setProgress(100);
            job.setStatus(ScanJob.ScanStatus.COMPLETED);
            job.setCompletedAt(LocalDateTime.now());
            
            scanJobRepository.save(job);
            
            log.info("Scan completed for job {} - Open: {}, Closed: {}, Filtered: {}", 
                     jobId, openCount, closedCount, filteredCount);
            
        } catch (Exception e) {
            log.error("Scan failed for job {}: {}", jobId, e.getMessage(), e);
            job.setStatus(ScanJob.ScanStatus.FAILED);
            job.setErrorMessage(e.getMessage());
            scanJobRepository.save(job);
        }
    }
    
    public ScanResponse getScanStatus(Long jobId) {
        ScanJob job = scanJobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Scan job not found: " + jobId));
        return mapToResponse(job);
    }
    
    public ScanJob getScanResults(Long jobId) {
        return scanJobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Scan job not found: " + jobId));
    }
    
    public Page<ScanJob> getAllScans(Pageable pageable) {
        return scanJobRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    @Transactional
    public void deleteScan(Long jobId) {
        if (!scanJobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Scan job not found: " + jobId);
        }
        scanJobRepository.deleteById(jobId);
    }
    
    private List<Integer> parsePorts(String portRange) {
        List<Integer> ports = new ArrayList<>();
        
        if ("common".equalsIgnoreCase(portRange)) {
            return config.getCommonPorts();
        }
        
        if ("all".equalsIgnoreCase(portRange)) {
            // All ports 1-65535 (use with caution!)
            for (int i = 1; i <= 65535; i++) {
                ports.add(i);
            }
            return ports;
        }
        
        String[] parts = portRange.split(",");
        for (String part : parts) {
            part = part.trim();
            if (part.contains("-")) {
                String[] range = part.split("-");
                int start = Integer.parseInt(range[0].trim());
                int end = Integer.parseInt(range[1].trim());
                for (int i = start; i <= end; i++) {
                    ports.add(i);
                }
            } else {
                ports.add(Integer.parseInt(part));
            }
        }
        
        return ports;
    }
    
    private ScanResponse mapToResponse(ScanJob job) {
        ScanResponse.PortStatistics stats = null;
        
        if (job.getTotalPorts() != null && job.getTotalPorts() > 0) {
            int total = job.getTotalPorts();
            stats = ScanResponse.PortStatistics.builder()
                    .openCount(job.getOpenPorts())
                    .closedCount(job.getClosedPorts())
                    .filteredCount(job.getFilteredPorts())
                    .openPercentage(job.getOpenPorts() * 100.0 / total)
                    .closedPercentage(job.getClosedPorts() * 100.0 / total)
                    .filteredPercentage(job.getFilteredPorts() * 100.0 / total)
                    .build();
        }
        
        return ScanResponse.builder()
                .jobId(job.getId())
                .target(job.getTarget())
                .portRange(job.getPortRange())
                .status(job.getStatus())
                .progress(job.getProgress())
                .totalPorts(job.getTotalPorts())
                .scannedPorts(job.getScannedPorts())
                .openPorts(job.getOpenPorts())
                .closedPorts(job.getClosedPorts())
                .filteredPorts(job.getFilteredPorts())
                .createdAt(job.getCreatedAt())
                .completedAt(job.getCompletedAt())
                .statistics(stats)
                .build();
    }
}
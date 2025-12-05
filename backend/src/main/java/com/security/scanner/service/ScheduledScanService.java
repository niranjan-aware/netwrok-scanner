package com.security.scanner.service;

import com.security.scanner.dto.ScheduledScanRequest;
import com.security.scanner.dto.ScanRequest;
import com.security.scanner.exception.ResourceNotFoundException;
import com.security.scanner.model.ScheduledScan;
import com.security.scanner.repository.ScheduledScanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledScanService {
    
    private final ScheduledScanRepository scheduledScanRepository;
    private final ScanJobService scanJobService;
    
    @Transactional
    public ScheduledScan createScheduledScan(ScheduledScanRequest request) {
        ScheduledScan scan = ScheduledScan.builder()
                .name(request.getName())
                .target(request.getTarget())
                .portRange(request.getPortRange())
                .cronExpression(request.getCronExpression())
                .enabled(true)
                .build();
        
        return scheduledScanRepository.save(scan);
    }
    
    public List<ScheduledScan> getAllScheduledScans() {
        return scheduledScanRepository.findAll();
    }
    
    public ScheduledScan getScheduledScan(Long id) {
        return scheduledScanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled scan not found: " + id));
    }
    
    @Transactional
    public ScheduledScan updateScheduledScan(Long id, ScheduledScanRequest request) {
        ScheduledScan scan = getScheduledScan(id);
        scan.setName(request.getName());
        scan.setTarget(request.getTarget());
        scan.setPortRange(request.getPortRange());
        scan.setCronExpression(request.getCronExpression());
        return scheduledScanRepository.save(scan);
    }
    
    @Transactional
    public void toggleScheduledScan(Long id) {
        ScheduledScan scan = getScheduledScan(id);
        scan.setEnabled(!scan.getEnabled());
        scheduledScanRepository.save(scan);
    }
    
    @Transactional
    public void deleteScheduledScan(Long id) {
        if (!scheduledScanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Scheduled scan not found: " + id);
        }
        scheduledScanRepository.deleteById(id);
    }
    
    @Scheduled(fixedRate = 60000) // Check every minute
    @Transactional
    public void executeScheduledScans() {
        List<ScheduledScan> activeScans = scheduledScanRepository.findByEnabledTrue();
        
        for (ScheduledScan scan : activeScans) {
            if (shouldRun(scan)) {
                log.info("Executing scheduled scan: {}", scan.getName());
                
                ScanRequest request = new ScanRequest();
                request.setTarget(scan.getTarget());
                request.setPortRange(scan.getPortRange());
                
                scanJobService.createScanJob(request);
                
                scan.setLastRunAt(LocalDateTime.now());
                scheduledScanRepository.save(scan);
            }
        }
    }
    
    private boolean shouldRun(ScheduledScan scan) {
        // Simplified cron check - in production, use a proper cron library
        if (scan.getLastRunAt() == null) {
            return true;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastRun = scan.getLastRunAt();
        
        // Simple hourly check for demo
        return now.isAfter(lastRun.plusHours(1));
    }
}

package com.security.scanner.service;

import com.security.scanner.model.ScanJob;
import com.security.scanner.repository.ScanJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final ScanJobRepository scanJobRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDateTime last24Hours = LocalDateTime.now().minusDays(1);
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);
        
        stats.put("totalScans", scanJobRepository.count());
        stats.put("scansLast24h", scanJobRepository.countScansSince(last24Hours));
        stats.put("scansLast7d", scanJobRepository.countScansSince(last7Days));
        
        stats.put("runningScans", scanJobRepository.countByStatus(ScanJob.ScanStatus.RUNNING));
        stats.put("completedScans", scanJobRepository.countByStatus(ScanJob.ScanStatus.COMPLETED));
        stats.put("failedScans", scanJobRepository.countByStatus(ScanJob.ScanStatus.FAILED));
        
        List<ScanJob> recentScans = scanJobRepository.findRecentScans(last7Days);
        stats.put("recentScans", recentScans);
        
        return stats;
    }
}

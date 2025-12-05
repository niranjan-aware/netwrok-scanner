package com.security.scanner.dto;

import com.security.scanner.model.ScanJob;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ScanResponse {
    private Long jobId;
    private String target;
    private String portRange;
    private ScanJob.ScanStatus status;
    private Integer progress;
    private Integer totalPorts;
    private Integer scannedPorts;
    
    // NEW: Detailed counts
    private Integer openPorts;
    private Integer closedPorts;
    private Integer filteredPorts;
    
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    // NEW: Statistics
    private PortStatistics statistics;
    
    @Data
    @Builder
    public static class PortStatistics {
        private Integer openCount;
        private Integer closedCount;
        private Integer filteredCount;
        private Double openPercentage;
        private Double closedPercentage;
        private Double filteredPercentage;
    }
}

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
    private Integer openPorts;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}

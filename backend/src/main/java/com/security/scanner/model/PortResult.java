package com.security.scanner.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "port_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer port;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PortStatus status;  // OPEN, CLOSED, FILTERED
    
    private String service;
    
    @Column(columnDefinition = "TEXT")
    private String banner;
    
    private Integer responseTime;
    
    @Column(columnDefinition = "TEXT")
    private String errorMessage;  // For closed/filtered ports
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_job_id", nullable = false)
    @JsonIgnore
    private ScanJob scanJob;
    
    // Enum for port status
    public enum PortStatus {
        OPEN,       // Connection successful
        CLOSED,     // Connection refused (RST packet)
        FILTERED    // Connection timeout (no response)
    }
    
    // Backward compatibility helper
    public Boolean getIsOpen() {
        return status == PortStatus.OPEN;
    }
}
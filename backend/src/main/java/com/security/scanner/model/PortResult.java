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
    
    @Column(nullable = false)
    private Boolean isOpen;
    
    private String service;
    
    @Column(columnDefinition = "TEXT")
    private String banner;
    
    private Integer responseTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_job_id", nullable = false)
    @JsonIgnore
    private ScanJob scanJob;
}

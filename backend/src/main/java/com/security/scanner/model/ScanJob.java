package com.security.scanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scan_jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanJob {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String target;
    
    @Column(nullable = false)
    private String portRange;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScanStatus status;
    
    private Integer progress;
    
    private Integer totalPorts;
    
    private Integer scannedPorts;
    
    private Integer openPorts;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime completedAt;
    
    @OneToMany(mappedBy = "scanJob", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PortResult> results = new ArrayList<>();
    
    @Column(columnDefinition = "TEXT")
    private String errorMessage;
    
    public enum ScanStatus {
        PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
    }
}

package com.security.scanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_scans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledScan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String target;
    
    @Column(nullable = false)
    private String portRange;
    
    @Column(nullable = false)
    private String cronExpression;
    
    @Column(nullable = false)
    private Boolean enabled;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime lastRunAt;
    
    private LocalDateTime nextRunAt;
}

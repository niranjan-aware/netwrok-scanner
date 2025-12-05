package com.security.scanner.repository;

import com.security.scanner.model.ScanJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScanJobRepository extends JpaRepository<ScanJob, Long> {
    
    Page<ScanJob> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<ScanJob> findByStatus(ScanJob.ScanStatus status);
    
    @Query("SELECT s FROM ScanJob s WHERE s.createdAt >= :since ORDER BY s.createdAt DESC")
    List<ScanJob> findRecentScans(LocalDateTime since);
    
    long countByStatus(ScanJob.ScanStatus status);
    
    @Query("SELECT COUNT(s) FROM ScanJob s WHERE s.createdAt >= :since")
    long countScansSince(LocalDateTime since);
}

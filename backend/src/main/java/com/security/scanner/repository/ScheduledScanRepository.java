package com.security.scanner.repository;

import com.security.scanner.model.ScheduledScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduledScanRepository extends JpaRepository<ScheduledScan, Long> {
    
    List<ScheduledScan> findByEnabledTrue();
}

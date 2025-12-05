
package com.security.scanner.repository;

import com.security.scanner.model.PortResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortResultRepository extends JpaRepository<PortResult, Long> {
    
    List<PortResult> findByScanJobId(Long scanJobId);
    
    List<PortResult> findByScanJobIdAndStatus(Long scanJobId, PortResult.PortStatus status);
    
    @Query("SELECT pr FROM PortResult pr WHERE pr.scanJob.id = :scanJobId AND pr.status = 'OPEN'")
    List<PortResult> findOpenPortsByScanJobId(Long scanJobId);
    
    @Query("SELECT pr FROM PortResult pr WHERE pr.scanJob.id = :scanJobId AND pr.status = 'CLOSED'")
    List<PortResult> findClosedPortsByScanJobId(Long scanJobId);
    
    @Query("SELECT pr FROM PortResult pr WHERE pr.scanJob.id = :scanJobId AND pr.status = 'FILTERED'")
    List<PortResult> findFilteredPortsByScanJobId(Long scanJobId);
    
    @Query("SELECT COUNT(pr) FROM PortResult pr WHERE pr.scanJob.id = :scanJobId AND pr.status = :status")
    long countByScanJobIdAndStatus(Long scanJobId, PortResult.PortStatus status);
}
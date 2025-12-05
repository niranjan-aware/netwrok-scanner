package com.security.scanner.repository;

import com.security.scanner.model.PortResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortResultRepository extends JpaRepository<PortResult, Long> {
    
    List<PortResult> findByScanJobId(Long scanJobId);
    
    List<PortResult> findByScanJobIdAndIsOpenTrue(Long scanJobId);
}

package com.security.scanner.controller;

import com.security.scanner.dto.ScanRequest;
import com.security.scanner.dto.ScanResponse;
import com.security.scanner.model.ScanJob;
import com.security.scanner.service.ScanJobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scans")
@RequiredArgsConstructor
@Tag(name = "Scan Management", description = "Port scanning operations")
public class ScanController {
    
    private final ScanJobService scanJobService;
    
    @PostMapping
    @Operation(summary = "Start a new port scan")
    public ResponseEntity<ScanResponse> startScan(@Valid @RequestBody ScanRequest request) {
        ScanResponse response = scanJobService.createScanJob(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{jobId}")
    @Operation(summary = "Get scan status")
    public ResponseEntity<ScanResponse> getScanStatus(@PathVariable Long jobId) {
        ScanResponse response = scanJobService.getScanStatus(jobId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{jobId}/results")
    @Operation(summary = "Get scan results")
    public ResponseEntity<ScanJob> getScanResults(@PathVariable Long jobId) {
        ScanJob job = scanJobService.getScanResults(jobId);
        return ResponseEntity.ok(job);
    }
    
    @GetMapping
    @Operation(summary = "Get all scans with pagination")
    public ResponseEntity<Page<ScanJob>> getAllScans(Pageable pageable) {
        Page<ScanJob> scans = scanJobService.getAllScans(pageable);
        return ResponseEntity.ok(scans);
    }
    
    @DeleteMapping("/{jobId}")
    @Operation(summary = "Delete a scan")
    public ResponseEntity<Void> deleteScan(@PathVariable Long jobId) {
        scanJobService.deleteScan(jobId);
        return ResponseEntity.noContent().build();
    }
}

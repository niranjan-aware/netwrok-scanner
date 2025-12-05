package com.security.scanner.controller;

import com.security.scanner.dto.ScheduledScanRequest;
import com.security.scanner.model.ScheduledScan;
import com.security.scanner.service.ScheduledScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduled-scans")
@RequiredArgsConstructor
@Tag(name = "Scheduled Scans", description = "Manage scheduled scans")
public class ScheduledScanController {
    
    private final ScheduledScanService scheduledScanService;
    
    @PostMapping
    @Operation(summary = "Create a scheduled scan")
    public ResponseEntity<ScheduledScan> createScheduledScan(
            @Valid @RequestBody ScheduledScanRequest request) {
        ScheduledScan scan = scheduledScanService.createScheduledScan(request);
        return ResponseEntity.ok(scan);
    }
    
    @GetMapping
    @Operation(summary = "Get all scheduled scans")
    public ResponseEntity<List<ScheduledScan>> getAllScheduledScans() {
        List<ScheduledScan> scans = scheduledScanService.getAllScheduledScans();
        return ResponseEntity.ok(scans);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get a scheduled scan by ID")
    public ResponseEntity<ScheduledScan> getScheduledScan(@PathVariable Long id) {
        ScheduledScan scan = scheduledScanService.getScheduledScan(id);
        return ResponseEntity.ok(scan);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a scheduled scan")
    public ResponseEntity<ScheduledScan> updateScheduledScan(
            @PathVariable Long id,
            @Valid @RequestBody ScheduledScanRequest request) {
        ScheduledScan scan = scheduledScanService.updateScheduledScan(id, request);
        return ResponseEntity.ok(scan);
    }
    
    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Enable/disable a scheduled scan")
    public ResponseEntity<Void> toggleScheduledScan(@PathVariable Long id) {
        scheduledScanService.toggleScheduledScan(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a scheduled scan")
    public ResponseEntity<Void> deleteScheduledScan(@PathVariable Long id) {
        scheduledScanService.deleteScheduledScan(id);
        return ResponseEntity.noContent().build();
    }
}

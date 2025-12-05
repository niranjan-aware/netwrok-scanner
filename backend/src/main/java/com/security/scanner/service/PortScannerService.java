package com.security.scanner.service;

import com.security.scanner.config.ScannerConfig;
import com.security.scanner.model.PortResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortScannerService {
    
    private final ScannerConfig config;
    private final BannerGrabberService bannerGrabber;
    
    public List<PortResult> scanPorts(String target, List<Integer> ports) {
        List<PortResult> results = new ArrayList<>();
        Semaphore semaphore = new Semaphore(200);
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<CompletableFuture<PortResult>> futures = ports.stream()
                    .map(port -> CompletableFuture.supplyAsync(() -> scanPort(target, port), executor))
                    .toList();
            
            futures.forEach(future -> {
                try {
                    PortResult result = future.join();
                    if (result != null) {
                        results.add(result);
                    }
                } catch (Exception e) {
                    log.error("Error scanning port: {}", e.getMessage());
                }
            });
        }
        
        return results;
    }
    
    private PortResult scanPort(String target, int port) {
        long startTime = System.currentTimeMillis();
        
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(target, port), config.getDefaultTimeout());
            long responseTime = System.currentTimeMillis() - startTime;
            
            // Port is open, grab banner
            String banner = bannerGrabber.grabBanner(socket, port);
            String service = identifyService(port, banner);
            
            log.info("Port {} is OPEN on {} ({})", port, target, service);
            
            return PortResult.builder()
                    .port(port)
                    .isOpen(true)
                    .service(service)
                    .banner(banner)
                    .responseTime((int) responseTime)
                    .build();
            
        } catch (IOException e) {
            // Port is closed or filtered
            return null;
        }
    }
    
    private String identifyService(int port, String banner) {
        if (banner == null || banner.isEmpty()) {
            return getDefaultService(port);
        }
        
        // Service identification based on banner
        if (banner.contains("SSH-")) return "SSH";
        if (banner.contains("HTTP/")) return "HTTP";
        if (banner.contains("220") && banner.contains("FTP")) return "FTP";
        if (banner.contains("220") && banner.contains("SMTP")) return "SMTP";
        if (banner.contains("PONG")) return "Redis";
        if (banner.contains("mysql")) return "MySQL";
        if (banner.contains("PostgreSQL")) return "PostgreSQL";
        if (banner.contains("MongoDB")) return "MongoDB";
        
        return getDefaultService(port);
    }
    
    private String getDefaultService(int port) {
        return switch (port) {
            case 21 -> "FTP";
            case 22 -> "SSH";
            case 23 -> "Telnet";
            case 25 -> "SMTP";
            case 53 -> "DNS";
            case 80 -> "HTTP";
            case 110 -> "POP3";
            case 143 -> "IMAP";
            case 443 -> "HTTPS";
            case 445 -> "SMB";
            case 3306 -> "MySQL";
            case 3389 -> "RDP";
            case 5432 -> "PostgreSQL";
            case 6379 -> "Redis";
            case 8080 -> "HTTP-Proxy";
            case 8443 -> "HTTPS-Alt";
            case 27017 -> "MongoDB";
            default -> "Unknown";
        };
    }
}

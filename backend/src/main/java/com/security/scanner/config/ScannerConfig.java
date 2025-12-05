package com.security.scanner.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "scanner")
@Data
public class ScannerConfig {
    private int defaultTimeout;
    private int maxConcurrentPorts;
    private int maxConcurrentHosts;
    private int rateLimitDelay;
    private List<Integer> commonPorts;
}

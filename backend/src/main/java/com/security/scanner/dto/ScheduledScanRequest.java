package com.security.scanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ScheduledScanRequest {
    
    @NotBlank(message = "Name cannot be empty")
    private String name;
    
    @NotBlank(message = "Target cannot be empty")
    private String target;
    
    @NotBlank(message = "Port range cannot be empty")
    private String portRange;
    
    @NotBlank(message = "Cron expression cannot be empty")
    @Pattern(regexp = "^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\\d+(ns|us|µs|ms|s|m|h))+)|((((\\d+,)+\\d+|(\\d+([/\\-])\\d+)|\\d+|\\*) ?){5,7})$",
            message = "Invalid cron expression")
    private String cronExpression;
}

package com.security.scanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ScanRequest {
    
    @NotBlank(message = "Target cannot be empty")
    @Pattern(regexp = "^([0-9]{1,3}\\.){3}[0-9]{1,3}$|^([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
            message = "Invalid IP address or hostname")
    private String target;
    
    @NotBlank(message = "Port range cannot be empty")
    @Pattern(regexp = "^([0-9]+(-[0-9]+)?)(,([0-9]+(-[0-9]+)?))*$|^common$",
            message = "Invalid port range format. Use: 80,443,8080-8090 or 'common'")
    private String portRange;
    
    private Integer timeout;
}

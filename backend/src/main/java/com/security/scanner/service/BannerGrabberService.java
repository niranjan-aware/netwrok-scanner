package com.security.scanner.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class BannerGrabberService {
    
    public String grabBanner(Socket socket, int port) {
        try {
            socket.setSoTimeout(2000);
            
            InputStream input = socket.getInputStream();
            OutputStream output = socket.getOutputStream();
            
            // Send protocol-specific probes
            sendProbe(output, port);
            
            // Read response
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(input, StandardCharsets.UTF_8));
            
            StringBuilder banner = new StringBuilder();
            String line;
            int linesRead = 0;
            
            while (linesRead < 10 && (line = reader.readLine()) != null) {
                banner.append(line).append("\n");
                linesRead++;
                
                // Break early for some services
                if (line.contains("SSH-") || line.contains("HTTP/")) {
                    break;
                }
            }
            
            return banner.toString().trim();
            
        } catch (Exception e) {
            log.debug("Banner grab failed for port {}: {}", port, e.getMessage());
            return "";
        }
    }
    
    private void sendProbe(OutputStream output, int port) throws IOException {
        String probe = switch (port) {
            case 80, 8080 -> "GET / HTTP/1.0\r\n\r\n";
            case 443, 8443 -> "GET / HTTP/1.0\r\n\r\n";
            case 6379 -> "PING\r\n";
            case 3306 -> "";  // MySQL sends banner immediately
            case 5432 -> "";  // PostgreSQL sends banner immediately
            default -> "\r\n";
        };
        
        if (!probe.isEmpty()) {
            output.write(probe.getBytes(StandardCharsets.UTF_8));
            output.flush();
        }
    }
}

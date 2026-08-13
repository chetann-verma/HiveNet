package com.hivenet.features.authentication.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Sends transactional emails via Brevo REST API (HTTPS/443).
 * Replaces JavaMailSender SMTP which is blocked on Render's free tier.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendEmail(String toEmail, String subject, String content) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            headers.set("accept", "application/json");

            Map<String, Object> body = Map.of(
                "sender",      Map.of("name", "HiveNet", "email", senderEmail),
                "to",          new Object[]{Map.of("email", toEmail)},
                "subject",     subject,
                "htmlContent", content
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, request, String.class);
            log.info("Email sent to {} — status: {}", toEmail, response.getStatusCode());

        } catch (HttpClientErrorException e) {
            log.error("Brevo API error sending to {}: {} — {}", toEmail, e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }
}

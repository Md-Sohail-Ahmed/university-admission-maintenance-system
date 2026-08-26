package org.example.universitybackend.controller;

import com.razorpay.Utils;
import org.example.universitybackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class RazorpayWebhookController {

    private final PaymentService paymentService;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    public RazorpayWebhookController(
            PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature")
            String signature) {

        try {

            // Verify webhook came from Razorpay
            Utils.verifyWebhookSignature(
                    payload,
                    signature,
                    webhookSecret
            );

            paymentService.processWebhook(payload);

            return ResponseEntity.ok("Webhook received");

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid webhook");
        }
    }
}
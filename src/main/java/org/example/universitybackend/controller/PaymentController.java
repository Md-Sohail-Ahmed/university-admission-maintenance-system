package org.example.universitybackend.controller;

import org.example.universitybackend.dto.RazorpayOrderResponse;
import org.example.universitybackend.entity.Payment;
import org.example.universitybackend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create Razorpay order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestParam Integer admissionId,
            @RequestParam BigDecimal amount) {

        try {

            RazorpayOrderResponse response =
                    paymentService.createOrder(
                            admissionId,
                            amount
                    );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // Verify Razorpay payment
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature) {

        try {

            Payment payment =
                    paymentService.verifyPayment(
                            razorpayOrderId,
                            razorpayPaymentId,
                            razorpaySignature
                    );

            return ResponseEntity.ok(payment);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // Get all payments
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }


    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(
            @PathVariable Integer id) {

        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // Get payments for an admission
    @GetMapping("/admission/{admissionId}")
    public List<Payment> getPaymentsByAdmissionId(
            @PathVariable Integer admissionId) {

        return paymentService
                .getPaymentsByAdmissionId(admissionId);
    }
}
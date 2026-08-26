package org.example.universitybackend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.example.universitybackend.dto.RazorpayOrderResponse;
import org.example.universitybackend.entity.Admission;
import org.example.universitybackend.entity.Payment;
import org.example.universitybackend.repository.AdmissionRepository;
import org.example.universitybackend.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AdmissionRepository admissionRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public PaymentService(
            PaymentRepository paymentRepository,
            AdmissionRepository admissionRepository,
            RazorpayClient razorpayClient) {

        this.paymentRepository = paymentRepository;
        this.admissionRepository = admissionRepository;
        this.razorpayClient = razorpayClient;
    }


    // Create Razorpay order
    public RazorpayOrderResponse createOrder(
            Integer admissionId,
            BigDecimal amount) throws Exception {

        // Check admission exists
        Admission admission = admissionRepository
                .findById(admissionId)
                .orElseThrow(() ->
                        new RuntimeException("Admission not found")
                );

        // Validate amount
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid payment amount");
        }

        // Convert rupees to paise
        long amountInPaise = amount
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        // Create unique receipt
        String receipt =
                "UAMS_" + UUID.randomUUID();

        // Razorpay order request
        JSONObject orderRequest = new JSONObject();

        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", receipt);

        // Create order in Razorpay
        Order razorpayOrder =
                razorpayClient.orders.create(orderRequest);

        String razorpayOrderId =
                razorpayOrder.get("id");

        // Create local payment record
        Payment payment = new Payment();

        payment.setAdmission(admission);
        payment.setAmount(amount);
        payment.setStatus("CREATED");
        payment.setRazorpayOrderId(razorpayOrderId);

        String transactionId =
                "UAMS-TXN-" + UUID.randomUUID();

        payment.setTransactionId(transactionId);

        paymentRepository.save(payment);

        return new RazorpayOrderResponse(
                razorpayKeyId,
                razorpayOrderId,
                amount,
                "INR"
        );
    }


    // Verify Razorpay payment
    public Payment verifyPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) throws Exception {

        // Find our payment using OUR stored order ID
        Payment payment = paymentRepository
                .findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() ->
                        new RuntimeException("Payment order not found")
                );

        // Prepare signature verification data
        JSONObject options = new JSONObject();

        options.put(
                "razorpay_order_id",
                payment.getRazorpayOrderId()
        );

        options.put(
                "razorpay_payment_id",
                razorpayPaymentId
        );

        options.put(
                "razorpay_signature",
                razorpaySignature
        );

        // Verify signature
        boolean verified =
                Utils.verifyPaymentSignature(
                        options,
                        razorpayKeySecret
                );

        if (!verified) {

            payment.setStatus("FAILED");

            paymentRepository.save(payment);

            throw new RuntimeException(
                    "Payment signature verification failed"
            );
        }

        // Payment is authentic
        payment.setRazorpayPaymentId(
                razorpayPaymentId
        );

        payment.setRazorpaySignature(
                razorpaySignature
        );

        payment.setStatus("SUCCESS");

        return paymentRepository.save(payment);
    }


    // Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }


    // Get payment by ID
    public Optional<Payment> getPaymentById(Integer id) {
        return paymentRepository.findById(id);
    }


    // Get payments for admission
    public List<Payment> getPaymentsByAdmissionId(
            Integer admissionId) {

        return paymentRepository
                .findByAdmissionAdmissionId(admissionId);
    }
}
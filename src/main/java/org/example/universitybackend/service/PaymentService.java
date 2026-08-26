package org.example.universitybackend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.example.universitybackend.dto.PaymentSummaryResponse;
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
            Integer admissionId, BigDecimal amount) throws Exception {

        // Check admission exists
        Admission admission = admissionRepository
                .findById(admissionId)
                .orElseThrow(() ->
                        new RuntimeException("Admission not found")
                );
        BigDecimal courseFee = admission.getCourse().getFees();

        BigDecimal totalPaid =
                getTotalPaidForAdmission(admissionId);

        BigDecimal remaining =
                courseFee.subtract(totalPaid);

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Admission fee is already fully paid"
            );
        }
        // Validate amount
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid course fee");
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


        com.razorpay.Payment razorpayPayment =
                razorpayClient.payments.fetch(razorpayPaymentId);

        String method = razorpayPayment.get("method");
        payment.setPaymentMode(method);

        payment.setStatus("SUCCESS");

        return paymentRepository.save(payment);
    }


    public void processWebhook(String payload) {

        try {

            org.json.JSONObject webhook =
                    new org.json.JSONObject(payload);

            String event =
                    webhook.getString("event");

            if ("payment.captured".equals(event)) {

                org.json.JSONObject paymentEntity =
                        webhook
                                .getJSONObject("payload")
                                .getJSONObject("payment")
                                .getJSONObject("entity");

                String razorpayPaymentId =
                        paymentEntity.getString("id");

                String razorpayOrderId =
                        paymentEntity.getString("order_id");

                String method =
                        paymentEntity.getString("method");

                Payment payment =
                        paymentRepository
                                .findByRazorpayOrderId(
                                        razorpayOrderId
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Payment not found"
                                        )
                                );

                payment.setRazorpayPaymentId(
                        razorpayPaymentId
                );

                payment.setPaymentMode(method);

                payment.setStatus("SUCCESS");

                paymentRepository.save(payment);
            }

            else if ("payment.failed".equals(event)) {

                org.json.JSONObject paymentEntity =
                        webhook
                                .getJSONObject("payload")
                                .getJSONObject("payment")
                                .getJSONObject("entity");

                String razorpayOrderId =
                        paymentEntity.getString("order_id");

                Payment payment =
                        paymentRepository
                                .findByRazorpayOrderId(
                                        razorpayOrderId
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Payment not found"
                                        )
                                );

                payment.setStatus("FAILED");

                paymentRepository.save(payment);
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to process webhook",
                    e
            );
        }
    }

    public BigDecimal getTotalPaidForAdmission(Integer admissionId) {

        List<Payment> payments =
                paymentRepository.findByAdmissionAdmissionId(admissionId);

        return payments.stream()
                .filter(payment ->
                        "SUCCESS".equalsIgnoreCase(payment.getStatus()))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getRemainingAmount(Integer admissionId) {

        Admission admission = admissionRepository
                .findById(admissionId)
                .orElseThrow(() ->
                        new RuntimeException("Admission not found")
                );

        BigDecimal courseFee =
                admission.getCourse().getFees();

        BigDecimal totalPaid =
                getTotalPaidForAdmission(admissionId);

        BigDecimal remaining =
                courseFee.subtract(totalPaid);

        if (remaining.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }

        return remaining;
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

    public List<Payment> getPaymentsByAdmission(Integer admissionId) {

        return paymentRepository
                .findByAdmissionAdmissionId(admissionId);
    }

    public PaymentSummaryResponse getPaymentSummary(
            Integer admissionId) {

        Admission admission = admissionRepository
                .findById(admissionId)
                .orElseThrow(() ->
                        new RuntimeException("Admission not found")
                );

        BigDecimal courseFee =
                admission.getCourse().getFees();

        BigDecimal totalPaid =
                getTotalPaidForAdmission(admissionId);

        BigDecimal remaining =
                courseFee.subtract(totalPaid);

        if (remaining.compareTo(BigDecimal.ZERO) < 0) {
            remaining = BigDecimal.ZERO;
        }

        List<Payment> payments =
                paymentRepository
                        .findByAdmissionAdmissionId(admissionId);

        return new PaymentSummaryResponse(
                admissionId,
                courseFee,
                totalPaid,
                remaining,
                payments
        );
    }
}
package org.example.universitybackend.dto;

import org.example.universitybackend.entity.Payment;

import java.math.BigDecimal;
import java.util.List;

public class PaymentSummaryResponse {

    private Integer admissionId;
    private BigDecimal courseFee;
    private BigDecimal totalPaid;
    private BigDecimal remainingAmount;
    private List<Payment> payments;

    public PaymentSummaryResponse() {
    }

    public PaymentSummaryResponse(
            Integer admissionId,
            BigDecimal courseFee,
            BigDecimal totalPaid,
            BigDecimal remainingAmount,
            List<Payment> payments) {

        this.admissionId = admissionId;
        this.courseFee = courseFee;
        this.totalPaid = totalPaid;
        this.remainingAmount = remainingAmount;
        this.payments = payments;
    }

    public Integer getAdmissionId() {
        return admissionId;
    }

    public void setAdmissionId(Integer admissionId) {
        this.admissionId = admissionId;
    }

    public BigDecimal getCourseFee() {
        return courseFee;
    }

    public void setCourseFee(BigDecimal courseFee) {
        this.courseFee = courseFee;
    }

    public BigDecimal getTotalPaid() {
        return totalPaid;
    }

    public void setTotalPaid(BigDecimal totalPaid) {
        this.totalPaid = totalPaid;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
}
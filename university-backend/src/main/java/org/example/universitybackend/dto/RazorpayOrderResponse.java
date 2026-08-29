package org.example.universitybackend.dto;

import java.math.BigDecimal;

public class RazorpayOrderResponse {

    private String keyId;
    private String orderId;
    private BigDecimal amount;
    private String currency;

    public RazorpayOrderResponse() {
    }

    public RazorpayOrderResponse(
            String keyId,
            String orderId,
            BigDecimal amount,
            String currency) {

        this.keyId = keyId;
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
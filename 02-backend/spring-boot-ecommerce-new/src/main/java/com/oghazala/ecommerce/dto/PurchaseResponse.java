package com.oghazala.ecommerce.dto;

import lombok.Data;

@Data
public class PurchaseResponse {
    // add a final instead of a constructor
    private String orderTrackingNumber;

    public PurchaseResponse(){}

    public PurchaseResponse(String orderTrackingNumber) {
        this.orderTrackingNumber = orderTrackingNumber;
    }
}

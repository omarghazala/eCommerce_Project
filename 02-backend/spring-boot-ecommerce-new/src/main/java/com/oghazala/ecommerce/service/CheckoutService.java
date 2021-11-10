package com.oghazala.ecommerce.service;

import com.oghazala.ecommerce.dto.Purchase;
import com.oghazala.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}

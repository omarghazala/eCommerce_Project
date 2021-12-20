package com.oghazala.ecommerce.service;

import com.oghazala.ecommerce.dto.PaymentInfo;
import com.oghazala.ecommerce.dto.Purchase;
import com.oghazala.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}

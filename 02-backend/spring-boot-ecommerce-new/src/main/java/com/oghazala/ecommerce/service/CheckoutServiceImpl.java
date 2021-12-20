package com.oghazala.ecommerce.service;

import com.oghazala.ecommerce.dao.CustomerRepository;
import com.oghazala.ecommerce.dto.PaymentInfo;
import com.oghazala.ecommerce.dto.Purchase;
import com.oghazala.ecommerce.dto.PurchaseResponse;
import com.oghazala.ecommerce.entity.Customer;
import com.oghazala.ecommerce.entity.Order;
import com.oghazala.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;


    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey){
        this.customerRepository=customerRepository;
        Stripe.apiKey = secretKey;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(orderItem -> {
            order.add(orderItem);
        });
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        Customer customer = purchase.getCustomer();
        String theEmail = customer.getEmail();
        Customer customrFromDb = customerRepository.findByEmail(theEmail);
        if(customrFromDb != null){
            customer = customrFromDb;
        }
        customer.add(order);
        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String,Object> params = new HashMap<>();
        params.put("amount",paymentInfo.getAmount());
        params.put("currency",paymentInfo.getAmount());
        params.put("payment_method_types",paymentMethodTypes);
        return PaymentIntent.create(params);
    }

    // generate UUID VERSION-4
    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}

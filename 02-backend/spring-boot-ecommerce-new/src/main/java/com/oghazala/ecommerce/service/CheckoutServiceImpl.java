package com.oghazala.ecommerce.service;

import com.oghazala.ecommerce.dao.CustomerRepository;
import com.oghazala.ecommerce.dto.Purchase;
import com.oghazala.ecommerce.dto.PurchaseResponse;
import com.oghazala.ecommerce.entity.Customer;
import com.oghazala.ecommerce.entity.Order;
import com.oghazala.ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository){
        this.customerRepository=customerRepository;
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
        customer.add(order);
        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    // generate UUID VERSION-4
    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}

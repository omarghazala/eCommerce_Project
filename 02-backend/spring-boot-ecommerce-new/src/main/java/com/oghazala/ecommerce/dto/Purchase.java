package com.oghazala.ecommerce.dto;

import com.oghazala.ecommerce.entity.Address;
import com.oghazala.ecommerce.entity.Customer;
import com.oghazala.ecommerce.entity.Order;
import com.oghazala.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address billingAddress;
    private Address shippingAddress;
    private Order order;
    private Set<OrderItem> orderItems;


}

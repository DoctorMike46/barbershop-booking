package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.model.Product;

import java.util.List;

public interface ProductService {
    List<Product> findAll();
    Product save(Product product);
    void deleteById(Long id);
}

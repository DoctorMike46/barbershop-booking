package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}

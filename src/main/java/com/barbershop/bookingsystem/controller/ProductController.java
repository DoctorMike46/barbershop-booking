package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.model.Product;
import com.barbershop.bookingsystem.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.save(product);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product updatedProduct) {
        updatedProduct.setId(id);
        return ResponseEntity.ok(productService.save(updatedProduct));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteById(id);
    }
}

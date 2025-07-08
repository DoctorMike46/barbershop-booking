package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.model.HairService;
import com.barbershop.bookingsystem.repository.HairServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class HairServiceController {

    private final HairServiceRepository hairServiceRepo;

    @GetMapping
    public List<HairService> getAllServices() {
        return hairServiceRepo.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HairService> addService(@RequestBody HairService service) {
        return ResponseEntity.ok(hairServiceRepo.save(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody HairService updated) {
        return hairServiceRepo.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setDuration(updated.getDuration());
                    existing.setPrice(updated.getPrice());
                    return ResponseEntity.ok(hairServiceRepo.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (hairServiceRepo.existsById(id)) {
            hairServiceRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

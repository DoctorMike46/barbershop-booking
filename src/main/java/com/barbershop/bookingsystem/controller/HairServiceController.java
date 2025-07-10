package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.model.HairService;
import com.barbershop.bookingsystem.repository.HairServiceRepository;
import com.barbershop.bookingsystem.service.HairServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class HairServiceController {

    private final HairServiceService hairServiceService;

    @GetMapping
    public List<HairService> getAllServices() {
        return hairServiceService.getAllServices();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HairService> addService(@RequestBody HairService service) {
        return ResponseEntity.ok(hairServiceService.save(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody HairService updated) {
        return hairServiceService.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setDuration(updated.getDuration());
                    existing.setPrice(updated.getPrice());
                    return ResponseEntity.ok(hairServiceService.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        if (hairServiceService.existsById(id)) {
            hairServiceService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.model.HairService;
import com.barbershop.bookingsystem.repository.HairServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HairServiceService {

    private final HairServiceRepository hairServiceRepository;

    public List<HairService> getAllServices() {
        return hairServiceRepository.findAll();
    }

    public Optional<HairService> findById(Long id) {
        return hairServiceRepository.findById(id);
    }

    public HairService save(HairService service) {
        return hairServiceRepository.save(service);
    }

    public void deleteById(Long id) {
        hairServiceRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return hairServiceRepository.existsById(id);
    }
}

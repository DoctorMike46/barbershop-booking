package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.model.WorkingHour;
import com.barbershop.bookingsystem.repository.WorkingHourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkingHourService {

    private final WorkingHourRepository repository;

    public List<WorkingHour> findAll() {
        return repository.findAll();
    }

    public WorkingHour save(WorkingHour day) {
        return repository.save(day);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}

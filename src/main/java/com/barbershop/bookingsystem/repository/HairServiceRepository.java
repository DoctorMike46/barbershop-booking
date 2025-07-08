package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.HairService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HairServiceRepository extends JpaRepository<HairService, Long> {
}

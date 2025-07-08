package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
}

package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.WorkingHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.Optional;

public interface WorkingHourRepository extends JpaRepository<WorkingHour, Long> {
    Optional<WorkingHour> findByDayOfWeek(DayOfWeek dayOfWeek);
}


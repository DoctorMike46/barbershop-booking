package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.Booking;
import com.barbershop.bookingsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
}

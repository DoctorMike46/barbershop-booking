package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}

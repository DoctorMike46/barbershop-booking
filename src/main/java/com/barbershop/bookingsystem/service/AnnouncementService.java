package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.model.Announcement;
import com.barbershop.bookingsystem.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public List<Announcement> findAll() {
        return announcementRepository.findAll();
    }

    public Announcement save(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public void deleteById(Long id) {
        announcementRepository.deleteById(id);
    }
}

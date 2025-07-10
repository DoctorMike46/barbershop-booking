package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.model.Announcement;
import com.barbershop.bookingsystem.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public List<Announcement> getAll() {
        return announcementService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Announcement create(@RequestBody Announcement announcement) {
        return announcementService.save(announcement);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Announcement> update(@PathVariable Long id, @RequestBody Announcement updated) {
        updated.setId(id);
        return ResponseEntity.ok(announcementService.save(updated));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        announcementService.deleteById(id);
    }
}

package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.model.WorkingHour;
import com.barbershop.bookingsystem.service.WorkingHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/working-hours")
@RequiredArgsConstructor
public class WorkingHourController {

    private final WorkingHourService workingHourService;

    @GetMapping
    public List<WorkingHour> getAll() {
        return workingHourService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public WorkingHour create(@RequestBody WorkingHour day) {
        return workingHourService.save(day);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<WorkingHour> update(@PathVariable Long id, @RequestBody WorkingHour updatedDay) {
        return ResponseEntity.ok(workingHourService.save(
                WorkingHour.builder()
                        .id(id)
                        .dayOfWeek(updatedDay.getDayOfWeek())
                        .morningOpen(updatedDay.getMorningOpen())
                        .morningClose(updatedDay.getMorningClose())
                        .afternoonOpen(updatedDay.getAfternoonOpen())
                        .afternoonClose(updatedDay.getAfternoonClose())
                        .closedAllDay(updatedDay.isClosedAllDay())
                        .build()
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        workingHourService.deleteById(id);
    }
}

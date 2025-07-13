package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.model.TimeSlot;
import com.barbershop.bookingsystem.repository.TimeSlotRepository;
import com.barbershop.bookingsystem.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timeslots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;
    private final TimeSlotRepository timeSlotRepository;



    @GetMapping("/available")
    public ResponseEntity<List<TimeSlot>> getAvailableSlots(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("duration") int durationInMinutes) {
        return ResponseEntity.ok(timeSlotService.getAvailableSlots(date, durationInMinutes));
    }

    // Endpoint per generare slot per una certa data e durata
    @PostMapping("/generate")
    public ResponseEntity<Void> generateSlots(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("duration") int durationInMinutes) {
        timeSlotService.generateSlotsForDate(date, durationInMinutes);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/generate/weeks")
    public ResponseEntity<Void> generateSlotsNextWeeks(
            @RequestParam(value = "weeks", defaultValue = "3") int weeks,
            @RequestParam(value = "step", defaultValue = "30") int stepMinutes
    ) {

        System.out.println("Weeks: " + weeks + " Step: " + stepMinutes);
        timeSlotService.generateSlotsForNextWeeks(weeks, stepMinutes);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/available-days")
    public ResponseEntity<List<LocalDate>> getAvailableDays() {
        List<LocalDate> days = timeSlotService.getAvailableDays();
        return ResponseEntity.ok(days);
    }
/*
    @GetMapping("/{serviceId}/available-days/{date}/time-slots")
    public ResponseEntity<List<TimeSlot>> getAvailableTimeSlots(
            @PathVariable Long serviceId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<TimeSlot> slots = timeSlotService.getAvailableTimeSlots(serviceId, date);
        return ResponseEntity.ok(slots);
    }

     */

}

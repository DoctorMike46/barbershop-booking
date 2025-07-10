package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.model.TimeSlot;
import com.barbershop.bookingsystem.model.WorkingHour;
import com.barbershop.bookingsystem.repository.TimeSlotRepository;
import com.barbershop.bookingsystem.repository.WorkingHourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final WorkingHourRepository workingHourRepository;

    public void generateSlotsForDate(LocalDate date, int serviceDurationMinutes) {
        Optional<WorkingHour> optional = workingHourRepository.findByDayOfWeek(date.getDayOfWeek());
        if (optional.isEmpty()) return;

        WorkingHour workingHour = optional.get();
        if (workingHour.isClosedAllDay()) return;


        List<TimeSlot> slots = new ArrayList<>();

        // Genera slot mattina
        if (workingHour.getMorningOpen() != null && workingHour.getMorningClose() != null) {
            slots.addAll(generateTimeRange(date, workingHour.getMorningOpen(), workingHour.getMorningClose(), serviceDurationMinutes));
        }

        // Genera slot pomeriggio
        if (workingHour.getAfternoonOpen() != null && workingHour.getAfternoonClose() != null) {
            slots.addAll(generateTimeRange(date, workingHour.getAfternoonOpen(), workingHour.getAfternoonClose(), serviceDurationMinutes));
        }

        for (TimeSlot slot : slots) {
            if (!timeSlotRepository.existsByDateAndStartTime(slot.getDate(), slot.getStartTime())) {
                timeSlotRepository.save(slot);
            }
        }
    }

    private List<TimeSlot> generateTimeRange(LocalDate date, LocalTime start, LocalTime end, int duration) {
        List<TimeSlot> list = new ArrayList<>();
        LocalTime current = start;
        while (current.plusMinutes(duration).isBefore(end) || current.plusMinutes(duration).equals(end)) {
            TimeSlot slot = new TimeSlot();
            slot.setDate(date);
            slot.setStartTime(current);
            slot.setEndTime(current.plusMinutes(duration));
            slot.setAvailable(true);
            list.add(slot);
            current = current.plusMinutes(duration);
        }
        return list;
    }

    public List<TimeSlot> getAvailableSlots(LocalDate date) {
        return timeSlotRepository.findByDate(date).stream()
                .filter(TimeSlot::isAvailable)
                .toList();
    }
}

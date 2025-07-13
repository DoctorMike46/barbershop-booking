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
import java.util.Set;
import java.util.stream.Collectors;

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

    // Ottieni slot disponibili per una data
    public List<TimeSlot> getAvailableSlots(LocalDate date, int durationInMinutes) {

        List<TimeSlot> allSlots = timeSlotRepository.findByDateOrderByStartTime(date)
                .stream()
                .filter(TimeSlot::isAvailable)
                .toList();

        List<TimeSlot> result = new ArrayList<>();

        int slotsNeeded = durationInMinutes / 30; // supponiamo che ogni slot sia da 30 minuti

        for (int i = 0; i <= allSlots.size() - slotsNeeded; i++) {
            boolean valid = true;

            for (int j = 1; j < slotsNeeded; j++) {
                LocalTime expectedStart = allSlots.get(i).getStartTime().plusMinutes(j * 30);
                if (!allSlots.get(i + j).getStartTime().equals(expectedStart)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                result.add(allSlots.get(i)); // aggiungi solo il primo slot come slot "prenotabile"
            }
        }

        return result;
    }
    public void generateSlotsForNextWeeks(int weeks, int stepMinutes) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusWeeks(weeks);

        for (LocalDate date = today; !date.isAfter(endDate); date = date.plusDays(1)) {
            Optional<WorkingHour> workingHourOpt = workingHourRepository.findByDayOfWeek(date.getDayOfWeek());
            if (workingHourOpt.isEmpty()) continue;

            WorkingHour workingHour = workingHourOpt.get();
            if (workingHour.isClosedAllDay()) continue;

            // Verifica slot già esistenti
            List<TimeSlot> existing = timeSlotRepository.findByDate(date);
            Set<LocalTime> existingStarts = existing.stream()
                    .map(TimeSlot::getStartTime)
                    .collect(Collectors.toSet());

            List<TimeSlot> toInsert = new ArrayList<>();

            if (workingHour.getMorningOpen() != null && workingHour.getMorningClose() != null) {
                toInsert.addAll(generateMissingSlots(date, workingHour.getMorningOpen(), workingHour.getMorningClose(), stepMinutes, existingStarts));
            }

            if (workingHour.getAfternoonOpen() != null && workingHour.getAfternoonClose() != null) {
                toInsert.addAll(generateMissingSlots(date, workingHour.getAfternoonOpen(), workingHour.getAfternoonClose(), stepMinutes, existingStarts));
            }

            timeSlotRepository.saveAll(toInsert);
        }
    }

    private List<TimeSlot> generateMissingSlots(LocalDate date, LocalTime start, LocalTime end, int step, Set<LocalTime> existingStarts) {
        List<TimeSlot> result = new ArrayList<>();
        LocalTime current = start;

        while (!current.plusMinutes(step).isAfter(end)) {
            if (!existingStarts.contains(current)) {
                TimeSlot slot = new TimeSlot();
                slot.setDate(date);
                slot.setStartTime(current);
                slot.setEndTime(current.plusMinutes(step));
                slot.setAvailable(true);
                result.add(slot);
            }
            current = current.plusMinutes(step);
        }

        return result;
    }


    public List<LocalDate> getAvailableDays() {
        return timeSlotRepository.findAvailableDates();
    }
/*
    public List<TimeSlot> getAvailableTimeSlots(Long serviceId, LocalDate date) {
        return timeSlotRepository.findByServiceIdAndDateAndAvailableTrue(serviceId, date);
    }

     */

}

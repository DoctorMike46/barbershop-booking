package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.model.TimeSlot;
import com.barbershop.bookingsystem.model.WorkingHour;
import com.barbershop.bookingsystem.repository.TimeSlotRepository;
import com.barbershop.bookingsystem.repository.WorkingHourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SlotScheduler {

    private final TimeSlotRepository timeSlotRepository;
    private final WorkingHourRepository workingHourRepository;

    // Ogni giorno alle 00:30
    @Scheduled(cron = "0 30 0 * * *")
    public void generateSlotsAutomatically() {
        LocalDate today = LocalDate.now();

        // 1. Elimina slot vecchi NON prenotati
        List<TimeSlot> oldSlots = timeSlotRepository.findAllByDateBefore(today);
        oldSlots.stream()
                .filter(TimeSlot::isAvailable)  // solo quelli liberi
                .forEach(timeSlotRepository::delete);

        // 2. Genera nuovi slot per i prossimi 21 giorni
        int DAYS_AHEAD = 21;
        for (int i = 0; i < DAYS_AHEAD; i++) {
            LocalDate date = today.plusDays(i);
            generateSlotsForDate(date);  // slot da 30 min
        }

        System.out.println("⏱️ Slot aggiornati automaticamente");
    }

    private void generateSlotsForDate(LocalDate date) {
        Optional<WorkingHour> optional = workingHourRepository.findByDayOfWeek(date.getDayOfWeek());
        if (optional.isEmpty() || optional.get().isClosedAllDay()) return;

        WorkingHour wh = optional.get();
        List<TimeSlot> newSlots = new ArrayList<>();

        if (wh.getMorningOpen() != null && wh.getMorningClose() != null)
            newSlots.addAll(generateRange(date, wh.getMorningOpen(), wh.getMorningClose()));
        if (wh.getAfternoonOpen() != null && wh.getAfternoonClose() != null)
            newSlots.addAll(generateRange(date, wh.getAfternoonOpen(), wh.getAfternoonClose()));

        for (TimeSlot slot : newSlots) {
            boolean exists = timeSlotRepository.existsByDateAndStartTime(slot.getDate(), slot.getStartTime());
            if (!exists) {
                timeSlotRepository.save(slot);
            }
        }
    }

    private List<TimeSlot> generateRange(LocalDate date, LocalTime start, LocalTime end) {
        List<TimeSlot> list = new ArrayList<>();
        LocalTime current = start;
        while (!current.plusMinutes(30).isAfter(end)) {
            TimeSlot slot = new TimeSlot();
            slot.setDate(date);
            slot.setStartTime(current);
            slot.setEndTime(current.plusMinutes(30));
            slot.setAvailable(true);
            list.add(slot);
            current = current.plusMinutes(30);
        }
        return list;
    }
}

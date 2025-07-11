package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.dto.BookingResponseDTO;
import com.barbershop.bookingsystem.model.*;
import com.barbershop.bookingsystem.repository.BookingRepository;
import com.barbershop.bookingsystem.repository.HairServiceRepository;
import com.barbershop.bookingsystem.repository.TimeSlotRepository;
import com.barbershop.bookingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final HairServiceRepository hairServiceRepository;
    private final UserRepository userRepository;

    public Booking createBooking(Long userId, Long serviceId, Long timeSlotId, String note) {
        User user = userRepository.findById(userId).orElseThrow();
        HairService service = hairServiceRepository.findById(serviceId).orElseThrow();
        TimeSlot firstSlot = timeSlotRepository.findById(timeSlotId).orElseThrow();

        int duration = service.getDuration(); // es. 60
        int slotLength = 30; // ogni slot dura 30 min
        int requiredSlots = duration / slotLength; // es. 2 slot da 30 min

        // Recupera tutti gli slot disponibili nella stessa data ordinati per orario
        List<TimeSlot> availableSlots = timeSlotRepository.findByDateOrderByStartTime(firstSlot.getDate())
                .stream()
                .filter(TimeSlot::isAvailable)
                .toList();

        // Trova la posizione dello slot selezionato
        int startIndex = -1;
        for (int i = 0; i <= availableSlots.size() - requiredSlots; i++) {
            if (availableSlots.get(i).getId().equals(firstSlot.getId())) {
                // Verifica che gli slot successivi siano consecutivi
                boolean valid = true;
                for (int j = 1; j < requiredSlots; j++) {
                    LocalTime expectedStart = firstSlot.getStartTime().plusMinutes(j * slotLength);
                    if (!availableSlots.get(i + j).getStartTime().equals(expectedStart)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    startIndex = i;
                    break;
                }
            }
        }

        if (startIndex == -1) {
            throw new RuntimeException("Non ci sono slot consecutivi sufficienti per questo servizio");
        }

        // Blocca tutti gli slot necessari
        List<TimeSlot> bookedSlots = new ArrayList<>();
        for (int i = 0; i < requiredSlots; i++) {
            TimeSlot slot = availableSlots.get(startIndex + i);
            slot.setAvailable(false);
            timeSlotRepository.save(slot);
            bookedSlots.add(slot);
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setTimeSlot(bookedSlots.getFirst()); // collegamento al primo slot
        booking.setNote(note);
        booking.setStatus(BookingStatus.PRENOTATO);

        return bookingRepository.save(booking);
    }




    public List<Booking> getBookingsByUser(User user) {
        return bookingRepository.findByUser(user);
    }

    public void cancelBooking(Long bookingId, User requester) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();

        boolean isAdmin = requester.getRole().equals(Role.ADMIN);
        boolean isOwner = booking.getUser().getId().equals(requester.getId());

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access denied");
        }

        HairService service = booking.getService();
        TimeSlot startingSlot = booking.getTimeSlot();
        int serviceDuration = service.getDuration(); // es. 60 minuti
        int slotDuration = 30;
        int requiredSlots = serviceDuration / slotDuration;

        // Recupera tutti gli slot del giorno ordinati
        List<TimeSlot> daySlots = timeSlotRepository.findByDateOrderByStartTimeAsc(startingSlot.getDate());

        // Trova l'indice dello slot iniziale
        int startIndex = -1;
        for (int i = 0; i < daySlots.size(); i++) {
            if (daySlots.get(i).getId().equals(startingSlot.getId())) {
                startIndex = i;
                break;
            }
        }

        if (startIndex == -1 || startIndex + requiredSlots > daySlots.size()) {
            throw new RuntimeException("Impossibile determinare gli slot da liberare");
        }

        // Libera tutti gli slot consecutivi
        for (int i = 0; i < requiredSlots; i++) {
            TimeSlot slotToFree = daySlots.get(startIndex + i);
            slotToFree.setAvailable(true);
            timeSlotRepository.save(slotToFree);
        }

        bookingRepository.deleteById(bookingId);
    }



    private BookingResponseDTO mapToDto(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .serviceName(booking.getService().getName())
                .date(booking.getTimeSlot().getDate())
                .startTime(booking.getTimeSlot().getStartTime())
                .endTime(booking.getTimeSlot().getEndTime())
                .note(booking.getNote())
                .status(booking.getStatus())
                .build();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}



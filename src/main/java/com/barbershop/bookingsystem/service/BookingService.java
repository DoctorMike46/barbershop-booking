package com.barbershop.bookingsystem.service;

import com.barbershop.bookingsystem.dto.BookingResponseDTO;
import com.barbershop.bookingsystem.model.*;
import com.barbershop.bookingsystem.repository.BookingRepository;
import com.barbershop.bookingsystem.repository.HairServiceRepository;
import com.barbershop.bookingsystem.repository.TimeSlotRepository;
import com.barbershop.bookingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        TimeSlot slot = timeSlotRepository.findById(timeSlotId).orElseThrow();

        if (!slot.isAvailable()) throw new RuntimeException("Time slot not available");

        slot.setAvailable(false);
        timeSlotRepository.save(slot);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setTimeSlot(slot);
        booking.setNote(note);
        booking.setStatus(BookingStatus.PRENOTATO);

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(User user) {
        return bookingRepository.findByUser(user);
    }

    public void cancelBooking(Long bookingId, User user) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        booking.setStatus(BookingStatus.CANCELLATO);
        TimeSlot slot = booking.getTimeSlot();
        slot.setAvailable(true);

        bookingRepository.save(booking);
        timeSlotRepository.save(slot);
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
}

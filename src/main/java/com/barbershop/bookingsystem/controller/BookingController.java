package com.barbershop.bookingsystem.controller;

import com.barbershop.bookingsystem.model.Booking;
import com.barbershop.bookingsystem.model.User;
import com.barbershop.bookingsystem.security.CustomUserDetails;
import com.barbershop.bookingsystem.service.BookingService;
import com.barbershop.bookingsystem.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody BookingRequest request
    )
    {

        Booking booking = bookingService.createBooking(userDetails.getId(), request.getServiceId(), request.getTimeSlotId(), request.getNote());
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Booking>> getUserBookings(
            @AuthenticationPrincipal CustomUserDetails userDetails)
    {
        User user = userService.findById(userDetails.getId()).orElseThrow();
        return ResponseEntity.ok(bookingService.getBookingsByUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        User user = userService.findById(userDetails.getId()).orElseThrow();
        bookingService.cancelBooking(id, user);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class BookingRequest {
        private Long serviceId;
        private Long timeSlotId;
        private String note;
    }
}

package com.barbershop.bookingsystem.dto;

import com.barbershop.bookingsystem.model.Booking;
import com.barbershop.bookingsystem.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {
    private Long id;
    private String serviceName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String note;
    private BookingStatus status;
    private String calendarLink;

    public BookingResponseDTO(Booking booking, String calendarLink) {
        this.id = booking.getId();
        this.serviceName = booking.getService().getName();
        this.date = booking.getTimeSlot().getDate();
        this.startTime = booking.getTimeSlot().getStartTime();
        this.endTime = booking.getTimeSlot().getEndTime();
        this.note = booking.getNote();
        this.status = booking.getStatus();
        this.calendarLink = calendarLink;
    }

    public static BookingResponseDTO fromBooking(Booking booking, String calendarLink) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .serviceName(booking.getService().getName())
                .date(booking.getTimeSlot().getDate())
                .startTime(booking.getTimeSlot().getStartTime())
                .endTime(booking.getTimeSlot().getEndTime())
                .note(booking.getNote())
                .status(booking.getStatus())
                .calendarLink(calendarLink)
                .build();
    }

}

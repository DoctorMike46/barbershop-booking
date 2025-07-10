package com.barbershop.bookingsystem.dto;

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
}

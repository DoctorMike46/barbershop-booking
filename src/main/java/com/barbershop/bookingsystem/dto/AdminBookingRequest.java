package com.barbershop.bookingsystem.dto;

import lombok.Data;

@Data
public class AdminBookingRequest {
    private Long userId;
    private Long serviceId;
    private Long timeSlotId;
    private String note;
}

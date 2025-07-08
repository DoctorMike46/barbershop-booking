package com.barbershop.bookingsystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private HairService service;

    @ManyToOne
    private TimeSlot timeSlot;

    private String note;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}

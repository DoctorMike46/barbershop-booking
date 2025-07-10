package com.barbershop.bookingsystem.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek; // LUNEDÌ, MARTEDÌ, ecc.

    private LocalTime morningOpen;
    private LocalTime morningClose;

    private LocalTime afternoonOpen;
    private LocalTime afternoonClose;

    private boolean closedAllDay;
}

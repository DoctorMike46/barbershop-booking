// TimeSlotRepository.java
package com.barbershop.bookingsystem.repository;

import com.barbershop.bookingsystem.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByDate(LocalDate date);
    List<TimeSlot> findByDateAndStartTimeBetween(LocalDate date, LocalTime start, LocalTime end);
    boolean existsByDateAndStartTime(LocalDate date, LocalTime startTime);
    List<TimeSlot> findByDateOrderByStartTimeAsc(LocalDate date);
    List<TimeSlot> findByDateOrderByStartTime(LocalDate date);
    List<TimeSlot> findAllByDateBefore(LocalDate date);

    @Query("""
        SELECT DISTINCT ts.date 
          FROM TimeSlot ts
         WHERE ts.available = true
         ORDER BY ts.date
    """)
    List<LocalDate> findAvailableDates();
}

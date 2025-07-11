package com.barbershop.bookingsystem.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.format.DateTimeFormatter;

public class CalendarLinkGenerator {

    public static String generateGoogleCalendarLink(String title, String description,
                                                    LocalDate date, LocalTime startTime, LocalTime endTime) {

        ZonedDateTime startDateTime = ZonedDateTime.of(date, startTime, ZoneId.systemDefault()).withZoneSameInstant(ZoneId.of("UTC"));
        ZonedDateTime endDateTime = ZonedDateTime.of(date, endTime, ZoneId.systemDefault()).withZoneSameInstant(ZoneId.of("UTC"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");
        String start = startDateTime.format(formatter);
        String end = endDateTime.format(formatter);

        String base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
        String text = "&text=" + URLEncoder.encode(title, StandardCharsets.UTF_8);
        String dates = "&dates=" + start + "/" + end;
        String details = "&details=" + URLEncoder.encode(description, StandardCharsets.UTF_8);

        return base + text + dates + details;
    }
}

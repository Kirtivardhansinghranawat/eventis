package com.eventis.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.eventis.model.Booking;
import com.eventis.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService
    ) {
        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(
            @RequestParam String eventId,
            @RequestBody List<String> seatNumbers,
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        Booking booking =
                bookingService.createBooking(
                        eventId,
                        seatNumbers,
                        userId
                );

        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{bookingId}/confirm")
    public ResponseEntity<Booking> confirmBooking(
            @PathVariable String bookingId,
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        Booking booking =
                bookingService.confirmBooking(
                        bookingId,
                        userId
                );

        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(
            @PathVariable String bookingId,
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        bookingService.cancelBooking(
                bookingId,
                userId
        );

        return ResponseEntity.ok(
                "Booking cancelled successfully"
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return ResponseEntity.ok(
                bookingService.getMyBookings(
                        userId
                )
        );
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getMyBooking(
            @PathVariable String bookingId,
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return ResponseEntity.ok(
                bookingService.getMyBooking(
                        bookingId,
                        userId
                )
        );
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Booking>> getEventBookings(
            @PathVariable String eventId
    ) {

        return ResponseEntity.ok(
                bookingService.getEventBookings(
                        eventId
                )
        );
    }
}
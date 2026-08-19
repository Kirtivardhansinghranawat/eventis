package com.eventis.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.eventis.dto.SeatLockRequest;
import com.eventis.model.Seat;
import com.eventis.service.SeatService;

@RestController
@RequestMapping("/api/events")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/{eventId}/seats")
    public ResponseEntity<List<Seat>> getSeats(
            @PathVariable String eventId
    ) {
        return ResponseEntity.ok(
                seatService.getSeatsByEvent(eventId)
        );
    }

    @GetMapping("/{eventId}/seats/{seatNumber}")
    public ResponseEntity<Seat> getSeat(
            @PathVariable String eventId,
            @PathVariable String seatNumber
    ) {
        return ResponseEntity.ok(
                seatService.getSeat(
                        eventId,
                        seatNumber
                )
        );
    }

    @PostMapping("/{eventId}/seats/lock")
    public ResponseEntity<List<Seat>> lockSeats(
            @PathVariable String eventId,
            @RequestBody SeatLockRequest request,
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        return ResponseEntity.ok(
                seatService.lockSeats(
                        eventId,
                        request.getSeatNumbers(),
                        userId
                )
        );
    }

    @PostMapping("/{eventId}/seats/release")
    public ResponseEntity<String> releaseSeats(
            @PathVariable String eventId,
            @RequestBody SeatLockRequest request,
            Authentication authentication
    ) {

        String userId =
                authentication.getName();

        seatService.releaseSeats(
                eventId,
                request.getSeatNumbers(),
                userId
        );

        return ResponseEntity.ok(
                "Seats released successfully"
        );
    }
}
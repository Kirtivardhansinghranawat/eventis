package com.eventis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.eventis.model.Seat;
import com.eventis.repository.SeatRepository;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public List<Seat> getSeatsByEvent(String eventId) {
        return seatRepository.findByEventId(eventId);
    }

    public Seat getSeat(String eventId, String seatNumber) {
        return seatRepository
                .findByEventIdAndSeatNumber(eventId, seatNumber)
                .orElseThrow(() ->
                        new RuntimeException("Seat not found"));
    }
}
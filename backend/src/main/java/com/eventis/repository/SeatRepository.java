package com.eventis.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eventis.model.Seat;

public interface SeatRepository extends MongoRepository<Seat, String> {

    List<Seat> findByEventId(String eventId);

    Optional<Seat> findByEventIdAndSeatNumber(
            String eventId,
            String seatNumber
    );

    List<Seat> findByEventIdAndStatus(
            String eventId,
            String status
    );

    void deleteByEventId(String eventId);
}
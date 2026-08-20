package com.eventis.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eventis.model.Booking;

public interface BookingRepository
        extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByEventId(String eventId);

    Optional<Booking> findByIdAndUserId(
            String id,
            String userId
    );
}
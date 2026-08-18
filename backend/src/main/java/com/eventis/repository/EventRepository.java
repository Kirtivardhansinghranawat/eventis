package com.eventis.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eventis.model.Event;

public interface EventRepository extends MongoRepository<Event, String> {

    List<Event> findByOrganiserId(String organiserId);
}
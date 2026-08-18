package com.eventis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.eventis.dto.EventRequest;
import com.eventis.model.Event;
import com.eventis.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(EventRequest request, String organiserId) {

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new RuntimeException("Event title is required");
        }

        if (request.getTotalSeats() <= 0) {
            throw new RuntimeException("Total seats must be greater than zero");
        }

        if (request.getPrice() < 0) {
            throw new RuntimeException("Price cannot be negative");
        }

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setPrice(request.getPrice());
        event.setTotalSeats(request.getTotalSeats());

        // Initially all seats are available
        event.setAvailableSeats(request.getTotalSeats());

        // Organiser comes from authenticated user
        event.setOrganiserId(organiserId);

        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String id) {

        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));
    }

    public List<Event> getEventsByOrganiser(String organiserId) {
        return eventRepository.findByOrganiserId(organiserId);
    }

    public Event updateEvent(
            String id,
            EventRequest request,
            String organiserId
    ) {

        Event event = getEventById(id);

        // Only the organiser who created the event can update it
        if (!event.getOrganiserId().equals(organiserId)) {
            throw new RuntimeException(
                    "You are not authorized to update this event"
            );
        }

        if (request.getTitle() == null ||
                request.getTitle().isBlank()) {

            throw new RuntimeException(
                    "Event title is required"
            );
        }

        if (request.getTotalSeats() <= 0) {
            throw new RuntimeException(
                    "Total seats must be greater than zero"
            );
        }

        if (request.getPrice() < 0) {
            throw new RuntimeException(
                    "Price cannot be negative"
            );
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setPrice(request.getPrice());

        /*
         * Preserve already booked seats when the organiser
         * changes the total capacity.
         */
        int bookedSeats =
                event.getTotalSeats() - event.getAvailableSeats();

        if (request.getTotalSeats() < bookedSeats) {
            throw new RuntimeException(
                    "Total seats cannot be less than already booked seats"
            );
        }

        event.setTotalSeats(request.getTotalSeats());
        event.setAvailableSeats(
                request.getTotalSeats() - bookedSeats
        );

        return eventRepository.save(event);
    }

    public void deleteEvent(
            String id,
            String organiserId
    ) {

        Event event = getEventById(id);

        // Only the organiser who created the event can delete it
        if (!event.getOrganiserId().equals(organiserId)) {
            throw new RuntimeException(
                    "You are not authorized to delete this event"
            );
        }

        eventRepository.delete(event);
    }
}
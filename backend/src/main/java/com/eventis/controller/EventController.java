package com.eventis.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.eventis.dto.EventRequest;
import com.eventis.model.Event;
import com.eventis.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Public - anyone can view all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }

    // Public - anyone can view event details
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(
                eventService.getEventById(id)
        );
    }

    // Protected - organiser only
    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody EventRequest request,
            Authentication authentication
    ) {

        String organiserEmail =
                authentication.getName();

        Event event = eventService.createEvent(
                request,
                organiserEmail
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(event);
    }

    // Protected - organiser only
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable String id,
            @RequestBody EventRequest request,
            Authentication authentication
    ) {

        String organiserEmail =
                authentication.getName();

        Event event = eventService.updateEvent(
                id,
                request,
                organiserEmail
        );

        return ResponseEntity.ok(event);
    }

    // Protected - organiser only
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable String id,
            Authentication authentication
    ) {

        String organiserEmail =
                authentication.getName();

        eventService.deleteEvent(
                id,
                organiserEmail
        );

        return ResponseEntity.ok(
                "Event deleted successfully"
        );
    }

    // Protected - organiser can see their own events
    @GetMapping("/organiser/my-events")
    public ResponseEntity<List<Event>> getMyEvents(
            Authentication authentication
    ) {

        String organiserEmail =
                authentication.getName();

        return ResponseEntity.ok(
                eventService.getEventsByOrganiser(
                        organiserEmail
                )
        );
    }
}
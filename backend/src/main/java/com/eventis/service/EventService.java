package com.eventis.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.eventis.dto.EventRequest;
import com.eventis.model.Event;
import com.eventis.model.Seat;
import com.eventis.repository.EventRepository;
import com.eventis.repository.SeatRepository;

@Service
public class EventService {

    private static final int SEATS_PER_ROW = 20;

    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;

    public EventService(
            EventRepository eventRepository,
            SeatRepository seatRepository
    ) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
    }

    public Event createEvent(
            EventRequest request,
            String organiserId
    ) {

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

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setPrice(request.getPrice());
        event.setTotalSeats(request.getTotalSeats());
        event.setAvailableSeats(request.getTotalSeats());
        event.setOrganiserId(organiserId);

        Event savedEvent =
                eventRepository.save(event);

        createSeats(
                savedEvent.getId(),
                request.getTotalSeats(),
                request.getPrice()
        );

        return savedEvent;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String id) {

        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found"
                        )
                );
    }

    public List<Event> getEventsByOrganiser(
            String organiserId
    ) {

        return eventRepository.findByOrganiserId(
                organiserId
        );
    }

    public Event updateEvent(
            String id,
            EventRequest request,
            String organiserId
    ) {

        Event event = getEventById(id);

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

        int occupiedSeats =
                event.getTotalSeats()
                - event.getAvailableSeats();

        if (request.getTotalSeats() < occupiedSeats) {

            throw new RuntimeException(
                    "Total seats cannot be less than already occupied seats"
            );
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setPrice(request.getPrice());

        updateSeats(
                event.getId(),
                event.getTotalSeats(),
                request.getTotalSeats(),
                request.getPrice()
        );

        event.setTotalSeats(
                request.getTotalSeats()
        );

        event.setAvailableSeats(
                request.getTotalSeats()
                - occupiedSeats
        );

        return eventRepository.save(event);
    }

    public void deleteEvent(
            String id,
            String organiserId
    ) {

        Event event = getEventById(id);

        if (!event.getOrganiserId().equals(organiserId)) {

            throw new RuntimeException(
                    "You are not authorized to delete this event"
            );
        }

        seatRepository.deleteByEventId(id);

        eventRepository.delete(event);
    }

    private void createSeats(
            String eventId,
            int totalSeats,
            double price
    ) {

        List<Seat> seats =
                new ArrayList<>();

        for (
                int seatIndex = 0;
                seatIndex < totalSeats;
                seatIndex++
        ) {

            Seat seat = new Seat();

            seat.setEventId(eventId);

            seat.setSeatNumber(
                    generateSeatNumber(seatIndex)
            );

            seat.setCategory("REGULAR");

            seat.setPrice(price);

            seat.setStatus("AVAILABLE");

            seat.setLockedBy(null);

            seat.setLockedUntil(null);

            seats.add(seat);
        }

        seatRepository.saveAll(seats);
    }

    private void updateSeats(
            String eventId,
            int oldTotalSeats,
            int newTotalSeats,
            double price
    ) {

        if (newTotalSeats > oldTotalSeats) {

            List<Seat> newSeats =
                    new ArrayList<>();

            for (
                    int seatIndex = oldTotalSeats;
                    seatIndex < newTotalSeats;
                    seatIndex++
            ) {

                Seat seat = new Seat();

                seat.setEventId(eventId);

                seat.setSeatNumber(
                        generateSeatNumber(seatIndex)
                );

                seat.setCategory("REGULAR");

                seat.setPrice(price);

                seat.setStatus("AVAILABLE");

                seat.setLockedBy(null);

                seat.setLockedUntil(null);

                newSeats.add(seat);
            }

            seatRepository.saveAll(newSeats);
        }

        if (newTotalSeats < oldTotalSeats) {

            List<Seat> seats =
                    seatRepository.findByEventId(eventId);

            List<Seat> seatsToDelete =
                    new ArrayList<>();

            for (Seat seat : seats) {

                int seatIndex =
                        getSeatIndex(
                                seat.getSeatNumber()
                        );

                if (
                        seatIndex >= newTotalSeats &&
                        "AVAILABLE".equals(
                                seat.getStatus()
                        )
                ) {

                    seatsToDelete.add(seat);
                }
            }

            seatRepository.deleteAll(
                    seatsToDelete
            );
        }

        List<Seat> seats =
                seatRepository.findByEventId(
                        eventId
                );

        for (Seat seat : seats) {
            seat.setPrice(price);
        }

        seatRepository.saveAll(seats);
    }

    private String generateSeatNumber(
            int seatIndex
    ) {

        int rowIndex =
                seatIndex / SEATS_PER_ROW;

        int seatNumber =
                (seatIndex % SEATS_PER_ROW) + 1;

        return getRowLabel(rowIndex)
                + seatNumber;
    }

    private String getRowLabel(
            int rowIndex
    ) {

        StringBuilder label =
                new StringBuilder();

        int value = rowIndex;

        while (value >= 0) {

            label.insert(
                    0,
                    (char) (
                            'A'
                            + (value % 26)
                    )
            );

            value =
                    (value / 26) - 1;
        }

        return label.toString();
    }

    private int getSeatIndex(
            String seatNumber
    ) {

        int rowIndex = 0;
        int position = 0;

        while (
                position < seatNumber.length()
                &&
                Character.isLetter(
                        seatNumber.charAt(position)
                )
        ) {

            rowIndex =
                    rowIndex * 26
                    +
                    (
                        Character.toUpperCase(
                                seatNumber.charAt(position)
                        ) - 'A' + 1
                    );

            position++;
        }

        rowIndex--;

        int number =
                Integer.parseInt(
                        seatNumber.substring(
                                position
                        )
                );

        return rowIndex * SEATS_PER_ROW
                + number - 1;
    }
}
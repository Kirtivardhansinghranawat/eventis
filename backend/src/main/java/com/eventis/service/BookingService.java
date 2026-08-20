package com.eventis.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.eventis.model.Booking;
import com.eventis.model.Event;
import com.eventis.repository.BookingRepository;
import com.eventis.repository.EventRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final SeatService seatService;

    public BookingService(
            BookingRepository bookingRepository,
            EventRepository eventRepository,
            SeatService seatService
    ) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.seatService = seatService;
    }

    public Booking createBooking(
            String eventId,
            List<String> seatNumbers,
            String userId
    ) {

        if (seatNumbers == null ||
                seatNumbers.isEmpty()) {

            throw new RuntimeException(
                    "At least one seat must be selected"
            );
        }

        if (userId == null ||
                userId.isBlank()) {

            throw new RuntimeException(
                    "User authentication is required"
            );
        }

        Event event =
                eventRepository
                        .findById(eventId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Event not found"
                                )
                        );

        List<String> uniqueSeatNumbers =
                seatNumbers.stream()
                        .distinct()
                        .toList();

        int numberOfSeats =
                uniqueSeatNumbers.size();

        double totalAmount =
                event.getPrice() * numberOfSeats;

        Booking booking =
                new Booking(
                        userId,
                        eventId,
                        uniqueSeatNumbers,
                        numberOfSeats,
                        totalAmount,
                        "PENDING",
                        "PENDING",
                        LocalDateTime.now()
                );

        return bookingRepository.save(booking);
    }

    public Booking confirmBooking(
            String bookingId,
            String userId
    ) {

        Booking booking =
                bookingRepository
                        .findByIdAndUserId(
                                bookingId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );

        if (!"PENDING".equals(
                booking.getBookingStatus()
        )) {

            throw new RuntimeException(
                    "Booking cannot be confirmed"
            );
        }

        seatService.confirmSeats(
                booking.getEventId(),
                booking.getSeatNumbers(),
                userId
        );

        booking.setBookingStatus("CONFIRMED");
        booking.setPaymentStatus("SUCCESS");

        return bookingRepository.save(booking);
    }

    public void cancelBooking(
            String bookingId,
            String userId
    ) {

        Booking booking =
                bookingRepository
                        .findByIdAndUserId(
                                bookingId,
                                userId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found"
                                )
                        );

        if ("CONFIRMED".equals(
                booking.getBookingStatus()
        )) {

            throw new RuntimeException(
                    "Confirmed booking cannot be cancelled"
            );
        }

        if ("CANCELLED".equals(
                booking.getBookingStatus()
        )) {

            return;
        }

        seatService.releaseSeats(
                booking.getEventId(),
                booking.getSeatNumbers(),
                userId
        );

        booking.setBookingStatus("CANCELLED");
        booking.setPaymentStatus("FAILED");

        bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(
            String userId
    ) {

        return bookingRepository.findByUserId(
                userId
        );
    }

    public Booking getMyBooking(
            String bookingId,
            String userId
    ) {

        return bookingRepository
                .findByIdAndUserId(
                        bookingId,
                        userId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        )
                );
    }

    public List<Booking> getEventBookings(
            String eventId
    ) {

        return bookingRepository.findByEventId(
                eventId
        );
    }
}
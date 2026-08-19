package com.eventis.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.eventis.model.Seat;
import com.eventis.repository.SeatRepository;

@Service
public class SeatService {

    private static final int LOCK_DURATION_MINUTES = 10;

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public List<Seat> getSeatsByEvent(String eventId) {

        List<Seat> seats =
                seatRepository.findByEventId(eventId);

        releaseExpiredLocks(seats);

        return seats;
    }

    public Seat getSeat(
            String eventId,
            String seatNumber
    ) {

        Seat seat =
                seatRepository
                        .findByEventIdAndSeatNumber(
                                eventId,
                                seatNumber
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seat not found"
                                )
                        );

        releaseExpiredLock(seat);

        return seat;
    }

    public List<Seat> lockSeats(
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

        List<String> uniqueSeatNumbers =
                seatNumbers.stream()
                        .distinct()
                        .toList();

        List<Seat> seats =
                new ArrayList<>();

        for (String seatNumber :
                uniqueSeatNumbers) {

            Seat seat =
                    seatRepository
                            .findByEventIdAndSeatNumber(
                                    eventId,
                                    seatNumber
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Seat "
                                            + seatNumber
                                            + " not found"
                                    )
                            );

            releaseExpiredLock(seat);

            if ("BOOKED".equals(
                    seat.getStatus()
            )) {

                throw new RuntimeException(
                        "Seat "
                        + seatNumber
                        + " is already booked"
                );
            }

            if ("LOCKED".equals(
                    seat.getStatus()
            )) {

                if (!userId.equals(
                        seat.getLockedBy()
                )) {

                    throw new RuntimeException(
                            "Seat "
                            + seatNumber
                            + " is currently locked"
                    );
                }
            }

            seats.add(seat);
        }

        LocalDateTime lockedUntil =
                LocalDateTime.now()
                        .plusMinutes(
                                LOCK_DURATION_MINUTES
                        );

        for (Seat seat : seats) {

            seat.setStatus("LOCKED");
            seat.setLockedBy(userId);
            seat.setLockedUntil(lockedUntil);
        }

        return seatRepository.saveAll(seats);
    }

    public void releaseSeats(
            String eventId,
            List<String> seatNumbers,
            String userId
    ) {

        if (seatNumbers == null ||
                seatNumbers.isEmpty()) {

            throw new RuntimeException(
                    "No seats were provided"
            );
        }

        for (String seatNumber :
                seatNumbers) {

            Seat seat =
                    seatRepository
                            .findByEventIdAndSeatNumber(
                                    eventId,
                                    seatNumber
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Seat "
                                            + seatNumber
                                            + " not found"
                                    )
                            );

            if ("LOCKED".equals(
                    seat.getStatus()
            ) &&
                    userId.equals(
                            seat.getLockedBy()
                    )) {

                seat.setStatus("AVAILABLE");
                seat.setLockedBy(null);
                seat.setLockedUntil(null);

                seatRepository.save(seat);
            }
        }
    }

    private void releaseExpiredLocks(
            List<Seat> seats
    ) {

        LocalDateTime now =
                LocalDateTime.now();

        List<Seat> expiredSeats =
                new ArrayList<>();

        for (Seat seat : seats) {

            if (
                    "LOCKED".equals(
                            seat.getStatus()
                    ) &&
                    seat.getLockedUntil() != null &&
                    seat.getLockedUntil()
                            .isBefore(now)
            ) {

                seat.setStatus("AVAILABLE");
                seat.setLockedBy(null);
                seat.setLockedUntil(null);

                expiredSeats.add(seat);
            }
        }

        if (!expiredSeats.isEmpty()) {
            seatRepository.saveAll(
                    expiredSeats
            );
        }
    }

    private void releaseExpiredLock(
            Seat seat
    ) {

        if (
                "LOCKED".equals(
                        seat.getStatus()
                ) &&
                seat.getLockedUntil() != null &&
                seat.getLockedUntil()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            seat.setStatus("AVAILABLE");
            seat.setLockedBy(null);
            seat.setLockedUntil(null);

            seatRepository.save(seat);
        }
    }
}
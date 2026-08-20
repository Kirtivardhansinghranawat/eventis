import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getEventById,
    getEventSeats,
    lockSeats,
    createBooking,
    confirmBooking
} from "../services/eventService";

import "../styles/eventDetails.css";
import "../styles/seat-selection.css";

const SEATS_PER_ROW = 20;

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [loading, setLoading] = useState(true);
    const [lockingSeats, setLockingSeats] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                setError("");

                const eventData = await getEventById(id);
                setEvent(eventData);

                const seatData = await getEventSeats(id);

                setSeats(
                    Array.isArray(seatData)
                        ? seatData
                        : []
                );
            } catch (error) {
                setError(
                    error.message ||
                    "Unable to load event."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    const handleSeatClick = (seat) => {
        if (seat.status !== "AVAILABLE") {
            return;
        }

        setError("");
        setSuccess("");

        setSelectedSeats((currentSeats) => {
            const alreadySelected =
                currentSeats.some(
                    (selectedSeat) =>
                        selectedSeat.seatNumber ===
                        seat.seatNumber
                );

            if (alreadySelected) {
                return currentSeats.filter(
                    (selectedSeat) =>
                        selectedSeat.seatNumber !==
                        seat.seatNumber
                );
            }

            return [
                ...currentSeats,
                seat
            ];
        });
    };

    const handleProceedToPayment = async () => {
        if (selectedSeats.length === 0) {
            setError("Please select at least one seat.");
            return;
        }

        try {
            setLockingSeats(true);
            setError("");
            setSuccess("");

            const seatNumbers =
                selectedSeats.map(
                    (seat) => seat.seatNumber
                );

            // ========================================
            // STEP 1: LOCK SELECTED SEATS
            // ========================================

            await lockSeats(
                id,
                seatNumbers
            );

            // ========================================
            // STEP 2: CREATE BOOKING
            // ========================================

            const booking =
                await createBooking(
                    id,
                    seatNumbers
                );

            if (!booking || !booking.id) {
                throw new Error(
                    "Booking could not be created."
                );
            }

            // ========================================
            // STEP 3: CONFIRM BOOKING
            // ========================================

            const confirmedBooking =
                await confirmBooking(
                    booking.id
                );

            // ========================================
            // SUCCESS
            // ========================================

            setSuccess(
                "Booking confirmed successfully!"
            );

            setSelectedSeats([]);

            // Refresh seats so the newly booked
            // seats are no longer selectable.
            const updatedSeats =
                await getEventSeats(id);

            setSeats(
                Array.isArray(updatedSeats)
                    ? updatedSeats
                    : []
            );

            /*
             * Give the user a moment to see the
             * successful booking message before
             * going to the dashboard.
             */
            setTimeout(() => {
                navigate("/attendee/dashboard");
            }, 1200);

        } catch (error) {
            setError(
                error.message ||
                "Unable to complete your booking."
            );

            /*
             * Refresh seat state after any failure.
             * This is especially important if locking
             * or booking failed.
             */
            try {
                const seatData =
                    await getEventSeats(id);

                setSeats(
                    Array.isArray(seatData)
                        ? seatData
                        : []
                );
            } catch {
                setSeats([]);
            }

            setSelectedSeats([]);
        } finally {
            setLockingSeats(false);
        }
    };

    const totalAmount =
        selectedSeats.reduce(
            (total, seat) =>
                total + Number(seat.price || 0),
            0
        );

    const groupedSeats = seats.reduce(
        (rows, seat) => {
            const seatNumber =
                String(seat.seatNumber || "");

            const rowMatch =
                seatNumber.match(/^[A-Z]+/);

            if (!rowMatch) {
                return rows;
            }

            const row = rowMatch[0];

            if (!rows[row]) {
                rows[row] = [];
            }

            rows[row].push(seat);

            return rows;
        },
        {}
    );

    Object.values(groupedSeats).forEach(
        (rowSeats) => {
            rowSeats.sort(
                (a, b) => {
                    const numberA =
                        parseInt(
                            String(a.seatNumber)
                                .replace(/^[A-Z]+/, ""),
                            10
                        );

                    const numberB =
                        parseInt(
                            String(b.seatNumber)
                                .replace(/^[A-Z]+/, ""),
                            10
                        );

                    return numberA - numberB;
                }
            );
        }
    );

    const rows =
        Object.keys(groupedSeats).sort(
            (a, b) => {
                if (a.length !== b.length) {
                    return a.length - b.length;
                }

                return a.localeCompare(b);
            }
        );

    if (loading) {
        return (
            <main className="event-details-page">
                <div className="event-details-status">
                    Loading event...
                </div>
            </main>
        );
    }

    if (error && !event) {
        return (
            <main className="event-details-page">
                <div className="event-details-status event-details-error">
                    {error}
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="event-details-page">
                <div className="event-details-status">
                    Event not found.
                </div>
            </main>
        );
    }

    return (
        <main className="event-details-page">

            <div className="event-details-container">

                {/* ========================================
                    EVENT HERO
                ======================================== */}

                <section className="event-hero">

                    <div className="event-category">
                        {event.category}
                    </div>

                    <h1>
                        {event.title}
                    </h1>

                    <p className="event-location">
                        <span>📍</span>
                        {event.location}
                    </p>

                </section>


                {/* ========================================
                    EVENT DESCRIPTION
                ======================================== */}

                <section className="event-info-card">

                    <h2>
                        About This Event
                    </h2>

                    <p className="event-description">
                        {event.description}
                    </p>

                </section>


                {/* ========================================
                    EVENT INFORMATION
                ======================================== */}

                <section className="event-info-card">

                    <h2>
                        Event Information
                    </h2>

                    <div className="event-information-grid">

                        <div className="event-information-item">

                            <span className="event-information-icon">
                                📅
                            </span>

                            <div>
                                <span>Date</span>

                                <strong>
                                    {event.date}
                                </strong>
                            </div>

                        </div>


                        <div className="event-information-item">

                            <span className="event-information-icon">
                                🕐
                            </span>

                            <div>
                                <span>Time</span>

                                <strong>
                                    {event.time}
                                </strong>
                            </div>

                        </div>


                        <div className="event-information-item">

                            <span className="event-information-icon">
                                📍
                            </span>

                            <div>
                                <span>Location</span>

                                <strong>
                                    {event.location}
                                </strong>
                            </div>

                        </div>


                        <div className="event-information-item">

                            <span className="event-information-icon">
                                🎟
                            </span>

                            <div>
                                <span>Ticket Price</span>

                                <strong>
                                    ₹{event.price}
                                </strong>
                            </div>

                        </div>


                        <div className="event-information-item">

                            <span className="event-information-icon">
                                💺
                            </span>

                            <div>
                                <span>Total Seats</span>

                                <strong>
                                    {event.totalSeats}
                                </strong>
                            </div>

                        </div>


                        <div className="event-information-item">

                            <span className="event-information-icon">
                                💺
                            </span>

                            <div>
                                <span>Available Seats</span>

                                <strong>
                                    {event.availableSeats}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ========================================
                    SEAT SELECTION
                ======================================== */}

                <section className="seat-selection-card">

                    <p className="seat-selection-label">
                        SELECT YOUR SEATS
                    </p>

                    <h2>
                        Choose Your Seats
                    </h2>


                    <div className="seat-screen">
                        STAGE
                    </div>


                    <div className="seat-legend">

                        <div>
                            <span className="legend-box available"></span>
                            <span>Available</span>
                        </div>

                        <div>
                            <span className="legend-box selected"></span>
                            <span>Selected</span>
                        </div>

                        <div>
                            <span className="legend-box booked"></span>
                            <span>Booked</span>
                        </div>

                    </div>


                    {seats.length === 0 ? (

                        <div className="seat-empty-message">
                            No seats are available for this event.
                        </div>

                    ) : (

                        <div className="seat-map-wrapper">

                            <div className="seat-map">

                                {/* COLUMN NUMBERS */}

                                <div
                                    className="seat-column-numbers"
                                    style={{
                                        gridTemplateColumns:
                                            `42px repeat(${SEATS_PER_ROW}, minmax(32px, 1fr))`
                                    }}
                                >

                                    <span></span>

                                    {Array.from(
                                        {
                                            length: SEATS_PER_ROW
                                        },
                                        (_, index) => (
                                            <span key={index}>
                                                {index + 1}
                                            </span>
                                        )
                                    )}

                                </div>


                                {/* SEAT ROWS */}

                                {rows.map((row) => {

                                    const rowSeats =
                                        groupedSeats[row];

                                    const seatMap =
                                        new Map(
                                            rowSeats.map(
                                                (seat) => [
                                                    String(
                                                        seat.seatNumber
                                                    ),
                                                    seat
                                                ]
                                            )
                                        );

                                    return (
                                        <div
                                            className="seat-row"
                                            key={row}
                                            style={{
                                                gridTemplateColumns:
                                                    `42px repeat(${SEATS_PER_ROW}, minmax(32px, 1fr))`
                                            }}
                                        >

                                            <span className="seat-row-label">
                                                {row}
                                            </span>


                                            {Array.from(
                                                {
                                                    length:
                                                        SEATS_PER_ROW
                                                },
                                                (_, index) => {

                                                    const seatNumber =
                                                        `${row}${index + 1}`;

                                                    const seat =
                                                        seatMap.get(
                                                            seatNumber
                                                        );


                                                    if (!seat) {
                                                        return (
                                                            <span
                                                                key={
                                                                    seatNumber
                                                                }
                                                                className="seat-empty"
                                                            />
                                                        );
                                                    }


                                                    const selected =
                                                        selectedSeats.some(
                                                            (selectedSeat) =>
                                                                selectedSeat.seatNumber ===
                                                                seat.seatNumber
                                                        );


                                                    if (
                                                        seat.status === "LOCKED" ||
                                                        seat.status === "BOOKED"
                                                    ) {
                                                        return (
                                                            <button
                                                                key={
                                                                    seat.seatNumber
                                                                }
                                                                type="button"
                                                                className="seat seat-booked"
                                                                disabled
                                                            >
                                                                {seat.seatNumber}
                                                            </button>
                                                        );
                                                    }


                                                    return (
                                                        <button
                                                            key={
                                                                seat.seatNumber
                                                            }
                                                            type="button"
                                                            className={
                                                                selected
                                                                    ? "seat seat-selected"
                                                                    : "seat seat-available"
                                                            }
                                                            disabled={lockingSeats}
                                                            onClick={() =>
                                                                handleSeatClick(
                                                                    seat
                                                                )
                                                            }
                                                        >
                                                            {seat.seatNumber}
                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>
                                    );
                                })}

                            </div>

                        </div>
                    )}


                    {/* ========================================
                        SUCCESS MESSAGE
                    ======================================== */}

                    {success && (
                        <div className="event-details-status">
                            {success}
                        </div>
                    )}


                    {/* ========================================
                        ERROR MESSAGE
                    ======================================== */}

                    {error && (
                        <div className="event-details-status event-details-error">
                            {error}
                        </div>
                    )}


                    {/* ========================================
                        BOOKING SUMMARY
                    ======================================== */}

                    <div className="booking-summary">

                        <div className="selected-seat-summary">

                            <span>
                                Selected Seats (
                                {selectedSeats.length}
                                )
                            </span>

                            <strong>
                                {selectedSeats.length === 0
                                    ? "None"
                                    : selectedSeats
                                        .map(
                                            (seat) =>
                                                seat.seatNumber
                                        )
                                        .join(", ")}
                            </strong>

                        </div>


                        <div className="total-summary">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {totalAmount.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* ========================================
                        BOOKING BUTTON
                    ======================================== */}

                    <button
                        type="button"
                        className="proceed-payment-button"
                        disabled={
                            selectedSeats.length === 0 ||
                            lockingSeats
                        }
                        onClick={handleProceedToPayment}
                    >

                        <span>
                            {lockingSeats
                                ? "Confirming Booking..."
                                : "Confirm Booking"}
                        </span>

                        <span className="payment-arrow">
                            →
                        </span>

                    </button>

                </section>


                <footer className="event-details-footer">
                    © 2026 Eventis. All rights reserved.
                </footer>

            </div>

        </main>
    );
}

export default EventDetails;
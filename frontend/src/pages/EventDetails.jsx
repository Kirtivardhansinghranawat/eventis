import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getEventById,
    getEventSeats
} from "../services/eventService";

import "../styles/eventDetails.css";
import "../styles/seat-selection.css";

const SEATS_PER_ROW = 20;

function EventDetails() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const rows = Object.keys(groupedSeats).sort(
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

    if (error) {
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


                <section className="event-info-card">

                    <h2>
                        About This Event
                    </h2>

                    <p className="event-description">
                        {event.description}
                    </p>

                </section>


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
                                <span>
                                    Date
                                </span>

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
                                <span>
                                    Time
                                </span>

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
                                <span>
                                    Location
                                </span>

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
                                <span>
                                    Ticket Price
                                </span>

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
                                <span>
                                    Total Seats
                                </span>

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
                                <span>
                                    Available Seats
                                </span>

                                <strong>
                                    {event.availableSeats}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


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
                            <span>
                                Available
                            </span>
                        </div>

                        <div>
                            <span className="legend-box selected"></span>
                            <span>
                                Selected
                            </span>
                        </div>

                        <div>
                            <span className="legend-box booked"></span>
                            <span>
                                Booked
                            </span>
                        </div>

                    </div>


                    {seats.length === 0 ? (

                        <div className="seat-empty-message">
                            No seats are available for this event.
                        </div>

                    ) : (

                        <div className="seat-map-wrapper">

                            <div className="seat-map">

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
                                            <span
                                                key={index}
                                            >
                                                {index + 1}
                                            </span>
                                        )
                                    )}

                                </div>


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
                                                            (
                                                                selectedSeat
                                                            ) =>
                                                                selectedSeat.seatNumber ===
                                                                seat.seatNumber
                                                        );


                                                    const isBooked =
                                                        seat.status ===
                                                        "BOOKED";


                                                    const isLocked =
                                                        seat.status ===
                                                        "LOCKED";


                                                    let seatClass =
                                                        "seat seat-available";


                                                    if (selected) {

                                                        seatClass =
                                                            "seat seat-selected";

                                                    } else if (
                                                        isBooked
                                                    ) {

                                                        seatClass =
                                                            "seat seat-booked";

                                                    } else if (
                                                        isLocked
                                                    ) {

                                                        seatClass =
                                                            "seat seat-locked";
                                                    }


                                                    return (

                                                        <button
                                                            key={
                                                                seat.seatNumber
                                                            }
                                                            type="button"
                                                            className={
                                                                seatClass
                                                            }
                                                            disabled={
                                                                isBooked ||
                                                                isLocked
                                                            }
                                                            onClick={() =>
                                                                handleSeatClick(
                                                                    seat
                                                                )
                                                            }
                                                        >
                                                            {
                                                                seat.seatNumber
                                                            }
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


                    <button
                        type="button"
                        className="proceed-payment-button"
                        disabled={
                            selectedSeats.length === 0
                        }
                    >
                        <span>
                            Proceed to Payment
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
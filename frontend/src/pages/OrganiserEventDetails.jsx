import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getEventById,
    getEventSeats
} from "../services/eventService";

import "../styles/organiser-event-details.css";

function OrganiserEventDetails() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);

    const [seatStats, setSeatStats] = useState({
        available: 0,
        locked: 0,
        booked: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                setError("");

                const eventData = await getEventById(id);
                const seatData = await getEventSeats(id);

                setEvent(eventData);

                const seats = Array.isArray(seatData)
                    ? seatData
                    : [];

                setSeatStats({
                    available: seats.filter(
                        (seat) => seat.status === "AVAILABLE"
                    ).length,

                    locked: seats.filter(
                        (seat) => seat.status === "LOCKED"
                    ).length,

                    booked: seats.filter(
                        (seat) => seat.status === "BOOKED"
                    ).length
                });
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

    if (loading) {
        return (
            <main className="oed-page">
                <div className="oed-status">
                    Loading event...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="oed-page">
                <div className="oed-status oed-error">
                    {error}
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="oed-page">
                <div className="oed-status">
                    Event not found.
                </div>
            </main>
        );
    }

    return (
        <main className="oed-page">

            <section className="oed-card">

                <div className="oed-event-info">

                    <div className="oed-info-row">
                        <span>Time</span>
                        <strong>{event.time}</strong>
                    </div>

                    <div className="oed-info-row">
                        <span>Location</span>
                        <strong>{event.location}</strong>
                    </div>

                    <div className="oed-info-row">
                        <span>Ticket Price</span>
                        <strong>₹{event.price}</strong>
                    </div>

                </div>

                <div className="oed-seat-section">

                    <div className="oed-seat-heading">
                        <h2>Seat Status</h2>

                        <p>
                            Current status of seats for this event.
                        </p>
                    </div>

                    <div className="oed-seat-grid">

                        <div className="oed-seat-item">
                            <span>Total Seats</span>
                            <strong>
                                {event.totalSeats}
                            </strong>
                        </div>

                        <div className="oed-seat-item">
                            <span>Available</span>
                            <strong>
                                {seatStats.available}
                            </strong>
                        </div>

                        <div className="oed-seat-item">
                            <span>Locked</span>
                            <strong>
                                {seatStats.locked}
                            </strong>
                        </div>

                        <div className="oed-seat-item">
                            <span>Booked</span>
                            <strong>
                                {seatStats.booked}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="oed-actions">

                    <Link
                        to={`/organiser/events/edit/${event.id}`}
                        className="oed-edit-button"
                    >
                        Edit Event
                    </Link>

                    <Link
                        to="/organiser/dashboard"
                        className="oed-back-button"
                    >
                        Back to Dashboard
                    </Link>

                </div>

            </section>

        </main>
    );
}

export default OrganiserEventDetails;
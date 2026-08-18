import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../services/eventService";
import "../styles/eventDetails.css";

function EventDetails() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getEventById(id);

                setEvent(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <main className="event-details-page">
                <div className="event-details-status">
                    <p>Loading event...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="event-details-page">
                <div className="event-details-status event-details-error">
                    <h2>Unable to load event</h2>

                    <p>{error}</p>

                    <Link
                        to="/events"
                        className="event-details-back"
                    >
                        Back to Events
                    </Link>
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className="event-details-page">
                <div className="event-details-status">
                    <h2>Event not found</h2>

                    <p>
                        The event you are looking for does not exist.
                    </p>

                    <Link
                        to="/events"
                        className="event-details-back"
                    >
                        Back to Events
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="event-details-page">

            <div className="event-details-container">

                <Link
                    to="/events"
                    className="event-details-back"
                >
                    ← Back to Events
                </Link>

                <article className="event-details-card">

                    <div className="event-details-header">

                        <span className="event-details-category">
                            {event.category}
                        </span>

                        <h1>{event.title}</h1>

                        <p className="event-details-location">
                            📍 {event.location}
                        </p>

                    </div>

                    <section className="event-details-section">

                        <h2>About this event</h2>

                        <p>
                            {event.description}
                        </p>

                    </section>

                    <section className="event-details-info-grid">

                        <div className="event-details-info">
                            <span className="event-details-info-label">
                                Date
                            </span>

                            <strong>
                                {event.date}
                            </strong>
                        </div>

                        <div className="event-details-info">
                            <span className="event-details-info-label">
                                Time
                            </span>

                            <strong>
                                {event.time}
                            </strong>
                        </div>

                        <div className="event-details-info">
                            <span className="event-details-info-label">
                                Price
                            </span>

                            <strong>
                                ₹{event.price}
                            </strong>
                        </div>

                        <div className="event-details-info">
                            <span className="event-details-info-label">
                                Available Seats
                            </span>

                            <strong>
                                {event.availableSeats}
                            </strong>
                        </div>

                        <div className="event-details-info">
                            <span className="event-details-info-label">
                                Total Seats
                            </span>

                            <strong>
                                {event.totalSeats}
                            </strong>
                        </div>

                        <div className="event-details-info">
                            <span className="event-details-info-label">
                                Category
                            </span>

                            <strong>
                                {event.category}
                            </strong>
                        </div>

                    </section>

                    <div className="event-details-footer">

                        <div>
                            <span className="event-details-price-label">
                                Ticket Price
                            </span>

                            <div className="event-details-price">
                                ₹{event.price}
                            </div>
                        </div>

                        <button
                            className="event-details-button"
                            type="button"
                        >
                            Book / Reserve Seats
                        </button>

                    </div>

                </article>

            </div>

        </main>
    );
}

export default EventDetails;
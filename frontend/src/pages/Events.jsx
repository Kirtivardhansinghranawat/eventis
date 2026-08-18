import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { getAllEvents } from "../services/eventService";
import "../styles/events.css";

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAllEvents();

                setEvents(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <main className="events-page">

            <section className="events-header">

                <p className="events-label">
                    DISCOVER
                </p>

                <h1>
                    Explore Events
                </h1>

                <p>
                    Find events that match your interests and
                    create memorable experiences.
                </p>

            </section>

            {loading && (
                <div className="events-status">
                    <p>Loading events...</p>
                </div>
            )}

            {!loading && error && (
                <div className="events-status events-error">
                    <p>{error}</p>
                </div>
            )}

            {!loading &&
                !error &&
                events.length === 0 && (
                    <div className="events-status">

                        <h2>
                            No events available
                        </h2>

                        <p>
                            Check back later for upcoming events.
                        </p>

                    </div>
                )}

            {!loading &&
                !error &&
                events.length > 0 && (
                    <section className="events-grid">

                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                            />
                        ))}

                    </section>
                )}

        </main>
    );
}

export default Events;
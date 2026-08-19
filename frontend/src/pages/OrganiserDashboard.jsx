import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    getMyEvents,
    deleteEvent
} from "../services/eventService";
import "../styles/organiser-dashboard.css";

function OrganiserDashboard() {
    const { user } = useAuth();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyEvents();

            setEvents(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to load your events."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(id);

            await deleteEvent(id);

            setEvents((currentEvents) =>
                currentEvents.filter(
                    (event) => event.id !== id
                )
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to delete event."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    const totalSeats = events.reduce(
        (total, event) =>
            total + Number(event.totalSeats || 0),
        0
    );

    const availableSeats = events.reduce(
        (total, event) =>
            total + Number(event.availableSeats || 0),
        0
    );

    return (
        <main className="organiser-dashboard">

            <section className="organiser-dashboard-header">

                <div>
                    <p className="dashboard-label">
                        ORGANISER
                    </p>

                    <h1>
                        Welcome, {user?.name}
                    </h1>

                    <p>
                        Manage your events and create memorable
                        experiences for your attendees.
                    </p>
                </div>

                <Link
                    to="/organiser/events/create"
                    className="dashboard-create-button"
                >
                    Create Event
                </Link>

            </section>

            <section className="dashboard-stats">

                <div className="dashboard-stat-card">
                    <span>
                        Total Events
                    </span>

                    <strong>
                        {events.length}
                    </strong>
                </div>

                <div className="dashboard-stat-card">
                    <span>
                        Total Seats
                    </span>

                    <strong>
                        {totalSeats}
                    </strong>
                </div>

                <div className="dashboard-stat-card">
                    <span>
                        Available Seats
                    </span>

                    <strong>
                        {availableSeats}
                    </strong>
                </div>

            </section>

            <section className="organiser-events-section">

                <div className="section-header">

                    <div>
                        <p className="dashboard-label">
                            YOUR EVENTS
                        </p>

                        <h2>
                            Manage Events
                        </h2>
                    </div>

                    <Link
                        to="/organiser/events/create"
                        className="section-create-link"
                    >
                        + Create Event
                    </Link>

                </div>

                {loading && (
                    <div className="dashboard-status">
                        Loading your events...
                    </div>
                )}

                {!loading && error && (
                    <div className="dashboard-status dashboard-error">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    events.length === 0 && (
                        <div className="dashboard-empty">

                            <h3>
                                No events yet
                            </h3>

                            <p>
                                Create your first event and
                                start bringing people together.
                            </p>

                            <Link
                                to="/organiser/events/create"
                                className="dashboard-create-button"
                            >
                                Create Your First Event
                            </Link>

                        </div>
                    )}

                {!loading &&
                    !error &&
                    events.length > 0 && (
                        <div className="organiser-events-list">

                            {events.map((event) => (
                                <article
                                    className="organiser-event-card"
                                    key={event.id}
                                >

                                    <div className="organiser-event-info">

                                        <p className="event-category">
                                            {event.category}
                                        </p>

                                        <h3>
                                            {event.title}
                                        </h3>

                                        <p>
                                            {event.date} ·{" "}
                                            {event.time}
                                        </p>

                                        <p>
                                            {event.location}
                                        </p>

                                    </div>

                                    <div className="organiser-event-seats">

                                        <span>
                                            {event.availableSeats}
                                            {" "}
                                            /
                                            {" "}
                                            {event.totalSeats}
                                            {" "}
                                            seats available
                                        </span>

                                    </div>

                                    <div className="organiser-event-actions">

                                        <Link
                                            to={`/organiser/events/${event.id}`}
                                            className="event-action-view"
                                        >
                                            View
                                        </Link>

                                        <Link
                                            to={`/organiser/events/edit/${event.id}`}
                                            className="event-action-edit"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            type="button"
                                            className="event-action-delete"
                                            disabled={
                                                deleteLoading ===
                                                event.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    event.id
                                                )
                                            }
                                        >
                                            {deleteLoading ===
                                            event.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>

                                </article>
                            ))}

                        </div>
                    )}

            </section>

        </main>
    );
}

export default OrganiserDashboard;
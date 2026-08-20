import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getToken } from "../services/authService";
import "../styles/attendee-dashboard.css";

function AttendeeDashboard() {
    const { user } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError("");

                const token = getToken();

                if (!token) {
                    throw new Error("Authentication token not found.");
                }

                const bookingResponse = await fetch(
                    "http://localhost:8080/api/bookings/my",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const bookingData = await bookingResponse.json();

                if (!bookingResponse.ok) {
                    throw new Error(
                        typeof bookingData === "string"
                            ? bookingData
                            : "Failed to load bookings."
                    );
                }

                const bookingsWithEvents = await Promise.all(
                    bookingData.map(async (booking) => {
                        try {
                            const eventResponse = await fetch(
                                `http://localhost:8080/api/events/${booking.eventId}`
                            );

                            if (!eventResponse.ok) {
                                return {
                                    ...booking,
                                    event: null
                                };
                            }

                            const event = await eventResponse.json();

                            return {
                                ...booking,
                                event
                            };
                        } catch {
                            return {
                                ...booking,
                                event: null
                            };
                        }
                    })
                );

                setBookings(bookingsWithEvents);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <main className="attendee-dashboard">

            <section className="attendee-dashboard-header">

                <div>
                    <p className="attendee-dashboard-label">
                        ATTENDEE
                    </p>

                    <h1>
                        Welcome, {user?.name}
                    </h1>

                    <p>
                        Discover events, find your perfect seat and
                        manage your Eventis experience.
                    </p>
                </div>

                <Link
                    to="/events"
                    className="attendee-browse-button"
                >
                    Explore Events
                </Link>

            </section>

            <section className="attendee-dashboard-content">

                <div className="attendee-dashboard-card">

                    <div className="attendee-card-icon">
                        🎟
                    </div>

                    <div>
                        <p className="attendee-card-label">
                            DISCOVER
                        </p>

                        <h2>
                            Find Your Next Event
                        </h2>

                        <p>
                            Browse upcoming events, explore available
                            seats and choose the perfect spot for your
                            next experience.
                        </p>

                        <Link
                            to="/events"
                            className="attendee-card-button"
                        >
                            Browse Events
                        </Link>
                    </div>

                </div>

            </section>

            <section className="attendee-bookings-section">

                <div className="attendee-bookings-header">

                    <div>
                        <p className="attendee-card-label">
                            BOOKINGS
                        </p>

                        <h2>
                            My Bookings
                        </h2>
                    </div>

                    <Link
                        to="/events"
                        className="attendee-bookings-link"
                    >
                        Explore Events
                    </Link>

                </div>

                {loading && (
                    <div className="attendee-bookings-status">
                        Loading your bookings...
                    </div>
                )}

                {error && (
                    <div className="attendee-bookings-status attendee-bookings-error">
                        {error}
                    </div>
                )}

                {!loading && !error && bookings.length === 0 && (
                    <div className="attendee-bookings-status">

                        <h3>
                            No bookings yet
                        </h3>

                        <p>
                            Your confirmed event bookings will appear here.
                        </p>

                        <Link
                            to="/events"
                            className="attendee-card-button"
                        >
                            Browse Events
                        </Link>

                    </div>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <div className="attendee-bookings-list">

                        {bookings.map((booking) => (
                            <article
                                className="attendee-booking-card"
                                key={booking.id}
                            >

                                <div className="attendee-booking-main">

                                    <p className="attendee-card-label">
                                        EVENT
                                    </p>

                                    <h3>
                                        {booking.event?.title ||
                                            `Event ID: ${booking.eventId}`}
                                    </h3>

                                    {booking.event && (
                                        <>
                                            <p>
                                                {booking.event.date}
                                                {" · "}
                                                {booking.event.time}
                                            </p>

                                            <p>
                                                {booking.event.location}
                                            </p>
                                        </>
                                    )}

                                    <p>
                                        Booking ID: {booking.id}
                                    </p>

                                </div>

                                <div className="attendee-booking-details">

                                    <div>
                                        <span>
                                            Seats
                                        </span>

                                        <strong>
                                            {booking.seatNumbers?.join(", ")}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Number of Seats
                                        </span>

                                        <strong>
                                            {booking.numberOfSeats}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            ₹{booking.totalAmount}
                                        </strong>
                                    </div>

                                </div>

                                <div className="attendee-booking-statuses">

                                    <span
                                        className={
                                            booking.bookingStatus === "CONFIRMED"
                                                ? "booking-status confirmed"
                                                : "booking-status"
                                        }
                                    >
                                        {booking.bookingStatus}
                                    </span>

                                    <span
                                        className={
                                            booking.paymentStatus === "SUCCESS"
                                                ? "payment-status success"
                                                : "payment-status"
                                        }
                                    >
                                        Payment: {booking.paymentStatus}
                                    </span>

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default AttendeeDashboard;
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/attendee-dashboard.css";

function AttendeeDashboard() {
    const { user } = useAuth();

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

                <div className="attendee-dashboard-card">

                    <div className="attendee-card-icon">
                        ✓
                    </div>

                    <div>
                        <p className="attendee-card-label">
                            BOOKINGS
                        </p>

                        <h2>
                            My Bookings
                        </h2>

                        <p>
                            Your confirmed event bookings and tickets
                            will appear here.
                        </p>

                        <button
                            type="button"
                            className="attendee-card-button attendee-disabled-button"
                            disabled
                        >
                            My Bookings
                        </button>
                    </div>

                </div>

            </section>

        </main>
    );
}

export default AttendeeDashboard;
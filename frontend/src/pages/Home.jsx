import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

function Home() {
    const { user, isAuthenticated } = useAuth();

    return (
        <main className="home-page">

            {}

            <section className="hero">

                <div className="hero-content">

                    <span className="hero-label">
                        EVENTIS
                    </span>

                    <h1>
                        Discover events.
                        <br />
                        Create experiences.
                    </h1>

                    <p className="hero-description">
                        Find exciting events, discover new experiences,
                        and make every moment count with Eventis.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/events"
                            className="btn-primary"
                        >
                            Explore Events
                        </Link>

                        {!isAuthenticated && (
                            <Link
                                to="/register"
                                className="btn-secondary"
                            >
                                Create Account
                            </Link>
                        )}

                        {isAuthenticated &&
                            user?.role === "ORGANISER" && (
                                <Link
                                    to="/organiser/dashboard"
                                    className="btn-secondary"
                                >
                                    Organiser Dashboard
                                </Link>
                            )}

                    </div>

                </div>

            </section>


            {/* ========================================
                WELCOME SECTION
            ======================================== */}

            {isAuthenticated && (
                <section className="welcome-section">

                    <div className="container">

                        <div className="welcome-card">

                            <div>
                                <span className="welcome-label">
                                    WELCOME BACK
                                </span>

                                <h2>
                                    Hello, {user?.name}!
                                </h2>

                                <p>
                                    You are logged in as{" "}
                                    <strong>
                                        {user?.role}
                                    </strong>.
                                </p>
                            </div>

                            {user?.role === "ATTENDEE" && (
                                <Link
                                    to="/attendee/dashboard"
                                    className="btn-primary"
                                >
                                    My Dashboard
                                </Link>
                            )}

                            {user?.role === "ORGANISER" && (
                                <Link
                                    to="/organiser/dashboard"
                                    className="btn-primary"
                                >
                                    My Dashboard
                                </Link>
                            )}

                        </div>

                    </div>

                </section>
            )}


            {/* ========================================
                FEATURE SECTION
            ======================================== */}

            <section className="features-section">

                <div className="container">

                    <div className="section-header">

                        <span className="section-label">
                            WHY EVENTIS
                        </span>

                        <h2>
                            Everything you need for great events
                        </h2>

                        <p>
                            Eventis brings event discovery,
                            booking and management together
                            in one simple platform.
                        </p>

                    </div>


                    <div className="feature-grid">

                        {/* Feature 1 */}
                        <div className="feature-card">

                            <div className="feature-icon">
                                01
                            </div>

                            <h3>
                                Discover Events
                            </h3>

                            <p>
                                Explore events and find experiences
                                that match your interests.
                            </p>

                        </div>


                        {/* Feature 2 */}
                        <div className="feature-card">

                            <div className="feature-icon">
                                02
                            </div>

                            <h3>
                                Book Your Seat
                            </h3>

                            <p>
                                Choose your preferred seat and
                                reserve your place with ease.
                            </p>

                        </div>


                        {/* Feature 3 */}
                        <div className="feature-card">

                            <div className="feature-icon">
                                03
                            </div>

                            <h3>
                                Manage Events
                            </h3>

                            <p>
                                Organisers can create and manage
                                their events from one place.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;
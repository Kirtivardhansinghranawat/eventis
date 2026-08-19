import { Link } from "react-router-dom";
import eventHeroImage from "../assets/event-hero.png";
import "../styles/home.css";

function Home() {
    return (
        <main className="home-page">

            <section className="home-hero">

                <div className="home-hero-content">

                    <p className="home-eyebrow">
                        DISCOVER · CREATE · EXPERIENCE
                    </p>

                    <h1>
                        Your Event.
                        <br />
                        Your Experience.
                    </h1>

                    <p className="home-hero-text">
                        Discover exciting events, explore available
                        seats, choose your perfect spot and book
                        unforgettable experiences. Or create your own
                        event and bring people together.
                    </p>

                </div>

                <div className="home-hero-visual">

                    <div className="event-image-wrapper">
                        <img
                            src={eventHeroImage}
                            alt="People enjoying an event"
                            className="event-hero-image"
                        />
                    </div>

                </div>

            </section>

            <section className="home-role-section">

                <div className="home-role-heading">

                    <p>
                        GET STARTED
                    </p>

                    <h2>
                        How do you want to use Eventis?
                    </h2>

                    <span>
                        Choose your role to get started.
                    </span>

                </div>

                <div className="home-role-cards">

                    <article className="home-role-card">

                        <div className="role-icon">
                            🎟
                        </div>

                        <p className="role-label">
                            FOR ATTENDEES
                        </p>

                        <h3>
                            I am an Attendee
                        </h3>

                        <p className="role-description">
                            Discover events, explore available seats,
                            choose your favourite spot and book your
                            experience.
                        </p>

                        <div className="role-actions">

                            <Link
                                to="/login?role=ATTENDEE"
                                className="role-login-button"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register?role=ATTENDEE"
                                className="role-register-button"
                            >
                                Register
                            </Link>

                        </div>

                    </article>

                    <article className="home-role-card">

                        <div className="role-icon">
                            ✦
                        </div>

                        <p className="role-label">
                            FOR ORGANISERS
                        </p>

                        <h3>
                            I am an Organiser
                        </h3>

                        <p className="role-description">
                            Create events, manage your seats and bring
                            your audience together while giving them a
                            great experience.
                        </p>

                        <div className="role-actions">

                            <Link
                                to="/login?role=ORGANISER"
                                className="role-login-button"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register?role=ORGANISER"
                                className="role-register-button"
                            >
                                Register
                            </Link>

                        </div>

                    </article>

                </div>

            </section>

            <section className="home-bottom-message">

                <p>
                    DISCOVER · CREATE · EXPERIENCE
                </p>

                <h2>
                    One platform for every event.
                </h2>

            </section>

        </main>
    );
}

export default Home;
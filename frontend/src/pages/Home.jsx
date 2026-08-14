import { Link } from "react-router-dom";

function Home() {
    return (
        <main>

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-label">
                        EVENT REGISTRATION PLATFORM
                    </p>

                    <h1>
                        Discover Events.
                        <br />
                        Create Experiences.
                    </h1>

                    <p className="hero-description">
                        Eventis makes it simple to discover exciting events,
                        reserve your seats, and manage your event experience
                        from one place.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/events" className="btn-primary">
                            Explore Events
                        </Link>

                        <Link to="/register" className="btn-secondary">
                            Create Account
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Home;
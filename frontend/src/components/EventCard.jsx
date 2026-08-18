import { Link } from "react-router-dom";

function EventCard({ event }) {
    return (
        <article className="event-card">

            {/* Event category */}
            <div className="event-card-top">

                <span className="event-card-category">
                    {event.category}
                </span>

            </div>


            {/* Event information */}
            <div className="event-card-content">

                <h3 className="event-card-title">
                    {event.title}
                </h3>


                <p className="event-card-description">
                    {event.description}
                </p>


                {/* Date */}
                <div className="event-card-info">

                    <span className="event-card-icon">
                        📅
                    </span>

                    <span>
                        {event.date}
                    </span>

                    {event.time && (
                        <>
                            <span className="event-card-separator">
                                •
                            </span>

                            <span>
                                {event.time}
                            </span>
                        </>
                    )}

                </div>


                {/* Location */}
                <div className="event-card-info">

                    <span className="event-card-icon">
                        📍
                    </span>

                    <span>
                        {event.location}
                    </span>

                </div>


                {/* Seats */}
                <div className="event-card-info">

                    <span className="event-card-icon">
                        ○
                    </span>

                    <span>
                        {event.availableSeats} seats available
                    </span>

                </div>


                {/* Footer */}
                <div className="event-card-footer">

                    <div className="event-card-price">

                        <span className="event-card-price-label">
                            From
                        </span>

                        <span className="event-card-price-value">
                            ₹{event.price}
                        </span>

                    </div>


                    <Link
                        to={`/events/${event.id}`}
                        className="event-card-button"
                    >
                        View Event
                    </Link>

                </div>

            </div>

        </article>
    );
}

export default EventCard;
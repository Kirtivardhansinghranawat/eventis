import { Link } from "react-router-dom"

function EventCard({ event }){
    return(
        <div className="event-card">
            <div className="event-card-image">
                <img src={event.image} alt={event.title} />
            </div>
            <div className="event-card-content">

                <p className="event-card-category">{event.category}</p>

                <h3>{event.title}</h3>

                <p className="event-card-date">
                    {event.date}
                </p>

                <p className="event-card-location">
                    {event.location}
                </p>

                <div className="event-card-footer">
                    <span className="event-card-price">
                        ₹{event.price}
                    </span>

                    <Link to={`/events/${event.id}`}
                            className="event-card-button">
                        View Event
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default EventCard
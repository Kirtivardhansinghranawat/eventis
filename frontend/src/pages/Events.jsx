import EventCard from "../components/EventCard";

const events = [
    {
        id: 1,
        title: "Tech Innovation Summit",
        category: "Technology",
        date: "20 September 2026",
        location: "Jaipur, Rajasthan",
        price: 999,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
    },
    {
        id: 2,
        title: "Music & Culture Festival",
        category: "Music",
        date: "27 September 2026",
        location: "New Delhi",
        price: 1499,
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063"
    },
    {
        id: 3,
        title: "Entrepreneurship Meetup",
        category: "Business",
        date: "5 October 2026",
        location: "Mumbai, Maharashtra",
        price: 799,
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72"
    }
];

function Events() {
    return (
        <main className="events-page">

            <section className="events-header">

                <p className="events-label">
                    DISCOVER
                </p>

                <h1>Explore Events</h1>

                <p>
                    Find events that match your interests and create
                    memorable experiences.
                </p>

            </section>

            <section className="events-grid">

                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                    />
                ))}

            </section>

        </main>
    );
}

export default Events;
import { useParams } from "react-router-dom";

function EventDetails() {

    const { id } = useParams();

    return (
        <main>
            <h1>Event Details</h1>
            <p>Event ID: {id}</p>
        </main>
    );
}

export default EventDetails;
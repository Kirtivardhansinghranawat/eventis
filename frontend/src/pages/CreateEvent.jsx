import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/eventService";
import "../styles/create-event.css";

function CreateEvent() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        price: "",
        totalSeats: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        setErrors((current) => ({
            ...current,
            [name]: ""
        }));
    };

    const validateDateTime = () => {
        const newErrors = {};

        if (!formData.date) {
            newErrors.date = "Event date is required.";
        }

        if (!formData.time) {
            newErrors.time = "Event time is required.";
        }

        if (formData.date && formData.time) {
            const selectedDateTime = new Date(
                `${formData.date}T${formData.time}`
            );

            const now = new Date();

            if (Number.isNaN(selectedDateTime.getTime())) {
                newErrors.date = "Please enter a valid event date.";
                newErrors.time = "Please enter a valid event time.";
            } else if (selectedDateTime <= now) {
                newErrors.date =
                    "Event date and time must be in the future.";

                newErrors.time =
                    "Event date and time must be in the future.";
            }
        }

        return newErrors;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Event title is required.";
        } else if (formData.title.trim().length < 3) {
            newErrors.title =
                "Event title must contain at least 3 characters.";
        }

        if (!formData.description.trim()) {
            newErrors.description =
                "Event description is required.";
        } else if (formData.description.trim().length < 10) {
            newErrors.description =
                "Description must contain at least 10 characters.";
        }

        if (!formData.location.trim()) {
            newErrors.location =
                "Event location is required.";
        }

        if (!formData.category) {
            newErrors.category =
                "Please select an event category.";
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            newErrors.price =
                "Price cannot be negative.";
        }

        if (
            formData.totalSeats === "" ||
            Number(formData.totalSeats) <= 0 ||
            !Number.isInteger(Number(formData.totalSeats))
        ) {
            newErrors.totalSeats =
                "Total seats must be a positive whole number.";
        }

        const dateTimeErrors = validateDateTime();

        return {
            ...newErrors,
            ...dateTimeErrors
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);

            await createEvent({
                title: formData.title.trim(),
                description: formData.description.trim(),
                date: formData.date,
                time: formData.time,
                location: formData.location.trim(),
                category: formData.category,
                price: Number(formData.price),
                totalSeats: Number(formData.totalSeats)
            });

            navigate("/organiser/dashboard");
        } catch (error) {
            setErrors({
                form: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="create-event-page">

            <section className="create-event-header">

                <div>
                    <p className="create-event-label">
                        ORGANISER
                    </p>

                    <h1>
                        Create a New Event
                    </h1>

                    <p>
                        Add the details of your event and make it
                        available for attendees to discover.
                    </p>
                </div>

            </section>

            <section className="create-event-card">

                <form
                    className="create-event-form"
                    onSubmit={handleSubmit}
                >

                    <div className="create-event-section">

                        <div className="create-event-section-header">
                            <h2>
                                Event Information
                            </h2>

                            <p>
                                Tell attendees what your event is about.
                            </p>
                        </div>

                        <div className="create-event-field">

                            <label htmlFor="title">
                                Event Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter event title"
                                value={formData.title}
                                onChange={handleChange}
                            />

                            {errors.title && (
                                <span className="field-error">
                                    {errors.title}
                                </span>
                            )}

                        </div>

                        <div className="create-event-field">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                placeholder="Describe your event..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                            />

                            {errors.description && (
                                <span className="field-error">
                                    {errors.description}
                                </span>
                            )}

                        </div>

                        <div className="create-event-field">

                            <label htmlFor="category">
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select a category
                                </option>

                                <option value="Technology">
                                    Technology
                                </option>

                                <option value="Music">
                                    Music
                                </option>

                                <option value="Business">
                                    Business
                                </option>

                                <option value="Sports">
                                    Sports
                                </option>

                                <option value="Education">
                                    Education
                                </option>

                                <option value="Entertainment">
                                    Entertainment
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>

                            {errors.category && (
                                <span className="field-error">
                                    {errors.category}
                                </span>
                            )}

                        </div>

                    </div>

                    <div className="create-event-section">

                        <div className="create-event-section-header">
                            <h2>
                                Date & Location
                            </h2>

                            <p>
                                Set when and where your event will happen.
                            </p>
                        </div>

                        <div className="create-event-row">

                            <div className="create-event-field">

                                <label htmlFor="date">
                                    Event Date
                                </label>

                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    value={formData.date}
                                    onChange={handleChange}
                                />

                                {errors.date && (
                                    <span className="field-error">
                                        {errors.date}
                                    </span>
                                )}

                            </div>

                            <div className="create-event-field">

                                <label htmlFor="time">
                                    Event Time
                                </label>

                                <input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                />

                                {errors.time && (
                                    <span className="field-error">
                                        {errors.time}
                                    </span>
                                )}

                            </div>

                        </div>

                        <div className="create-event-field">

                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
                                placeholder="Enter event location"
                                value={formData.location}
                                onChange={handleChange}
                            />

                            {errors.location && (
                                <span className="field-error">
                                    {errors.location}
                                </span>
                            )}

                        </div>

                    </div>

                    <div className="create-event-section">

                        <div className="create-event-section-header">
                            <h2>
                                Pricing & Capacity
                            </h2>

                            <p>
                                Set your ticket price and available seats.
                            </p>
                        </div>

                        <div className="create-event-row">

                            <div className="create-event-field">

                                <label htmlFor="price">
                                    Ticket Price
                                </label>

                                <div className="input-with-prefix">
                                    <span>₹</span>

                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>

                                {errors.price && (
                                    <span className="field-error">
                                        {errors.price}
                                    </span>
                                )}

                            </div>

                            <div className="create-event-field">

                                <label htmlFor="totalSeats">
                                    Total Seats
                                </label>

                                <input
                                    id="totalSeats"
                                    name="totalSeats"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="100"
                                    value={formData.totalSeats}
                                    onChange={handleChange}
                                />

                                {errors.totalSeats && (
                                    <span className="field-error">
                                        {errors.totalSeats}
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>

                    {errors.form && (
                        <div className="create-event-error">
                            {errors.form}
                        </div>
                    )}

                    <div className="create-event-actions">

                        <button
                            type="button"
                            className="create-event-cancel"
                            onClick={() =>
                                navigate("/organiser/dashboard")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-event-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Event..."
                                : "Create Event"}
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

export default CreateEvent;
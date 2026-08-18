import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getEventById,
    updateEvent
} from "../services/eventService";
import "../styles/edit-event.css";

function EditEvent() {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const event = await getEventById(id);

                setFormData({
                    title: event.title || "",
                    description: event.description || "",
                    date: event.date || "",
                    time: event.time || "",
                    location: event.location || "",
                    category: event.category || "",
                    price: event.price ?? "",
                    totalSeats: event.totalSeats ?? ""
                });
            } catch (error) {
                setErrors({
                    form: error.message
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
            form: ""
        }));
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

        if (!formData.date) {
            newErrors.date = "Event date is required.";
        }

        if (!formData.time) {
            newErrors.time = "Event time is required.";
        }

        if (formData.date && formData.time) {
            const eventDateTime = new Date(
                `${formData.date}T${formData.time}`
            );

            if (
                Number.isNaN(eventDateTime.getTime())
            ) {
                newErrors.date = "Please enter a valid date.";
                newErrors.time = "Please enter a valid time.";
            }
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

        return newErrors;
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
            setSaving(true);

            await updateEvent(id, {
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
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="edit-event-page">
                <div className="edit-event-status">
                    Loading event...
                </div>
            </main>
        );
    }

    return (
        <main className="edit-event-page">

            <section className="edit-event-header">

                <div>
                    <p className="edit-event-label">
                        ORGANISER
                    </p>

                    <h1>
                        Edit Event
                    </h1>

                    <p>
                        Update your event information, schedule,
                        pricing, and capacity.
                    </p>
                </div>

            </section>

            <section className="edit-event-card">

                <form
                    className="edit-event-form"
                    onSubmit={handleSubmit}
                >

                    <div className="edit-event-section">

                        <div className="edit-event-section-header">
                            <h2>
                                Event Information
                            </h2>

                            <p>
                                Update the basic information attendees
                                will see.
                            </p>
                        </div>

                        <div className="edit-event-field">

                            <label htmlFor="title">
                                Event Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                            />

                            {errors.title && (
                                <span className="field-error">
                                    {errors.title}
                                </span>
                            )}

                        </div>

                        <div className="edit-event-field">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                            />

                            {errors.description && (
                                <span className="field-error">
                                    {errors.description}
                                </span>
                            )}

                        </div>

                        <div className="edit-event-field">

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

                    <div className="edit-event-section">

                        <div className="edit-event-section-header">
                            <h2>
                                Date & Location
                            </h2>

                            <p>
                                Update when and where your event
                                will take place.
                            </p>
                        </div>

                        <div className="edit-event-row">

                            <div className="edit-event-field">

                                <label htmlFor="date">
                                    Event Date
                                </label>

                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />

                                {errors.date && (
                                    <span className="field-error">
                                        {errors.date}
                                    </span>
                                )}

                            </div>

                            <div className="edit-event-field">

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

                        <div className="edit-event-field">

                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                type="text"
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

                    <div className="edit-event-section">

                        <div className="edit-event-section-header">
                            <h2>
                                Pricing & Capacity
                            </h2>

                            <p>
                                Update ticket pricing and total capacity.
                            </p>
                        </div>

                        <div className="edit-event-row">

                            <div className="edit-event-field">

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

                            <div className="edit-event-field">

                                <label htmlFor="totalSeats">
                                    Total Seats
                                </label>

                                <input
                                    id="totalSeats"
                                    name="totalSeats"
                                    type="number"
                                    min="1"
                                    step="1"
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
                        <div className="edit-event-error">
                            {errors.form}
                        </div>
                    )}

                    <div className="edit-event-actions">

                        <button
                            type="button"
                            className="edit-event-cancel"
                            onClick={() =>
                                navigate("/organiser/dashboard")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-event-submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}

export default EditEvent;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/auth.css";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ATTENDEE"
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // ========================================
    // FIELD VALIDATION
    // ========================================

    const validateField = (name, value) => {
        const newError = "";

        if (name === "name") {
            const nameValue = value.trim();

            if (!nameValue) {
                return "Name is required.";
            }

            if (nameValue.length < 2) {
                return "Name must be at least 2 characters.";
            }

            if (!/^[A-Za-z\s]+$/.test(nameValue)) {
                return "Name can contain only letters and spaces.";
            }
        }

        if (name === "email") {
            const emailValue = value.trim();

            if (!emailValue) {
                return "Email is required.";
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                return "Please enter a valid email address.";
            }
        }

        if (name === "password") {
            if (!value) {
                return "Password is required.";
            }

            if (value.length < 8) {
                return "Password must be at least 8 characters.";
            }

            if (!/[A-Za-z]/.test(value)) {
                return "Password must contain at least one letter.";
            }

            if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number.";
            }
        }

        if (name === "role") {
            if (
                value !== "ATTENDEE" &&
                value !== "ORGANISER"
            ) {
                return "Please select a valid account type.";
            }
        }

        return newError;
    };


    // ========================================
    // VALIDATE ENTIRE FORM
    // ========================================

    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach((field) => {
            const fieldError = validateField(
                field,
                formData[field]
            );

            if (fieldError) {
                newErrors[field] = fieldError;
            }
        });

        setErrors(newErrors);

        // Mark every field as touched
        setTouched({
            name: true,
            email: true,
            password: true,
            role: true
        });

        return Object.keys(newErrors).length === 0;
    };


    // ========================================
    // HANDLE INPUT
    // ========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        // Clear server messages when user starts editing
        setMessage("");
        setError("");

        // Live validation only after field has been touched
        if (touched[name]) {
            const fieldError = validateField(name, value);

            setErrors((previousErrors) => ({
                ...previousErrors,
                [name]: fieldError
            }));
        }
    };


    // ========================================
    // HANDLE BLUR
    // ========================================

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((previousTouched) => ({
            ...previousTouched,
            [name]: true
        }));

        const fieldError = validateField(name, value);

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: fieldError
        }));
    };


    // ========================================
    // SUBMIT
    // ========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Validate everything on submit
        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        const registrationData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.role
        };

        try {
            await registerUser(registrationData);

            setMessage("Registration successful!");

            setFormData({
                name: "",
                email: "",
                password: "",
                role: "ATTENDEE"
            });

            setErrors({});

            setTouched({});

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Eventis Logo */}
                <div className="auth-logo">
                    EVENT<span>IS</span>
                </div>


                {/* Header */}
                <div className="auth-header">

                    <h1>Create your account</h1>

                    <p>
                        Join events. Book seats. Keep everything
                        in one place.
                    </p>

                </div>


                {/* Registration Form */}
                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* ==============================
                        NAME
                    ============================== */}

                    <div className="auth-field">

                        <label htmlFor="name">
                            Full name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                                errors.name
                                    ? "input-error"
                                    : ""
                            }
                        />

                        {errors.name && (
                            <p className="field-error">
                                {errors.name}
                            </p>
                        )}

                    </div>


                    {/* ==============================
                        EMAIL
                    ============================== */}

                    <div className="auth-field">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                                errors.email
                                    ? "input-error"
                                    : ""
                            }
                        />

                        {errors.email && (
                            <p className="field-error">
                                {errors.email}
                            </p>
                        )}

                    </div>


                    {/* ==============================
                        PASSWORD
                    ============================== */}

                    <div className="auth-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={
                                    errors.password
                                        ? "input-error"
                                        : ""
                                }
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                        {errors.password && (
                            <p className="field-error">
                                {errors.password}
                            </p>
                        )}

                    </div>


                    {/* ==============================
                        ROLE
                    ============================== */}

                    <div className="auth-field">

                        <label htmlFor="role">
                            Account type
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={
                                errors.role
                                    ? "input-error"
                                    : ""
                            }
                        >
                            <option value="ATTENDEE">
                                Attendee
                            </option>

                            <option value="ORGANISER">
                                Organiser
                            </option>

                        </select>

                        {errors.role && (
                            <p className="field-error">
                                {errors.role}
                            </p>
                        )}

                    </div>


                    {/* ==============================
                        SUBMIT
                    ============================== */}

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Create Account
                    </button>

                </form>


                {/* Success */}
                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}


                {/* Backend Error */}
                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {/* Login Link */}
                <div className="auth-switch">

                    Already registered?{" "}

                    <Link to="/login">
                        Sign in
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;
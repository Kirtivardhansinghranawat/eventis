import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* Logo */}
                <Link
                    to="/"
                    className="navbar-logo"
                >
                    EVENT<span>IS</span>
                </Link>

                {/* Navigation */}
                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/events">
                        Events
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {/* Dashboard based on role */}
                            {user?.role === "ATTENDEE" && (
                                <Link to="/attendee/dashboard">
                                    Dashboard
                                </Link>
                            )}

                            {user?.role === "ORGANISER" && (
                                <Link to="/organiser/dashboard">
                                    Dashboard
                                </Link>
                            )}

                            {/* User name */}
                            <span className="navbar-user">
                                Hi, {user?.name}
                            </span>

                            {/* Logout */}
                            <button
                                type="button"
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="navbar-register"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
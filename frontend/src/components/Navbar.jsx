import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const attendeeDashboard = "/attendee/dashboard";
    const organiserDashboard = "/organiser/dashboard";

    const isDashboardPage =
        location.pathname === attendeeDashboard ||
        location.pathname === organiserDashboard;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar">

            <div className="navbar-container">

                <Link
                    to="/"
                    className="navbar-logo"
                >
                    EVENT<span>IS</span>
                </Link>

                <div className="navbar-links">

                    {location.pathname !== "/" && (
                        <Link to="/">
                            Home
                        </Link>
                    )}

                    {location.pathname !== "/events" && (
                        <Link to="/events">
                            Events
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            {!isDashboardPage && (
                                <>
                                    {user?.role === "ATTENDEE" && (
                                        <Link to={attendeeDashboard}>
                                            Dashboard
                                        </Link>
                                    )}

                                    {user?.role === "ORGANISER" && (
                                        <Link to={organiserDashboard}>
                                            Dashboard
                                        </Link>
                                    )}
                                </>
                            )}

                            <span className="navbar-user">
                                Hi, {user?.name}
                            </span>

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
                            {location.pathname !== "/login" && (
                                <Link to="/login">
                                    Login
                                </Link>
                            )}

                            {location.pathname !== "/register" && (
                                <Link
                                    to="/register"
                                    className="navbar-register"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
import { Link } from "react-router-dom"

function Navbar(){
    return(
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Eventis
                </Link>
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/events">Explore events</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register" className="navbar-register">Register</Link>
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar
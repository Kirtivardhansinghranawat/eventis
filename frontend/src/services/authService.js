const API_URL = "http://localhost:8080/api/auth";

// Login
export const loginUser = async (loginData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : "Login failed."
        );
    }

    // Save logged-in user and JWT
    localStorage.setItem(
        "eventisUser",
        JSON.stringify(data)
    );

    return data;
};


// Register
export const registerUser = async (registerData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : "Registration failed."
        );
    }

    return data;
};


// Logout
export const logoutUser = () => {
    localStorage.removeItem("eventisUser");
};


// Get currently logged-in user
export const getCurrentUser = () => {
    const user = localStorage.getItem("eventisUser");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        localStorage.removeItem("eventisUser");
        return null;
    }
};


// Get JWT token
export const getToken = () => {
    const user = getCurrentUser();

    return user?.token || null;
};


// Check whether user is logged in
export const isLoggedIn = () => {
    return getToken() !== null;
};
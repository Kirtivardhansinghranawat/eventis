import { createContext, useContext, useState } from "react";
import {
    getCurrentUser,
    loginUser,
    logoutUser
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getCurrentUser());

    const login = async (loginData) => {
        const loggedInUser = await loginUser(loginData);

        setUser(loggedInUser);

        return loggedInUser;
    };

    const logout = () => {
        logoutUser();

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: user !== null
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
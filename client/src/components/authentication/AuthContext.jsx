import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        setIsLoggedIn(!!authToken);
    }, []);

    const login = (data) => {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userType", data.userType);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
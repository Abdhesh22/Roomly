import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // 👈

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        setIsLoggedIn(!!authToken);
        setLoading(false); // 👈 auth check finished
    }, []);

    const login = (data) => {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem("userType", data.userType);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
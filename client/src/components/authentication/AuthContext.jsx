import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState(null);
    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        const userType = localStorage.getItem("userType");
        setIsLoggedIn(!!authToken);
        setUserType(userType);
        setLoading(false);
    }, []);

    const login = (data) => {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem("userType", data.userType);
        setUserType(data.userType);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, userType }}>
            {children}
        </AuthContext.Provider>
    );
};
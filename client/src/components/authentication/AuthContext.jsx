import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        _id: null,
        firstName: null,
        lastName: null,
        email: null,
        profileUrl: null,
        userType: null
    });

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

        setIsLoggedIn(!!authToken);
        setUser(storedUser);
        setLoading(false);
    }, []);

    const login = (data) => {

        const loggedUser = {
            _id: data.user._id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            userType: data.user.userType,
            profileUrl: data?.user?.profileAttachment?.remotePath
        }

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem("user", JSON.stringify(loggedUser));

        setUser(loggedUser);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, user, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
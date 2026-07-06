import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const checkUser = async () => {
            try {
                if (token) {
                    const response = await api.get("/user");
                    setUser(response.data)
                }
            } catch {
                setUser(null);
                setToken(null)
                localStorage.removeItem("token")
            }
        }

        checkUser();
    }, []);

    // ------------- register 
    const register = async (name, email, password, password_confirmation) => {
        const response = await api.post("/register", {name, email, password, password_confirmation});
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
    }

    // ------------- login 
    const login = async (email, password) => {
        const response = await api.post("/login", {email, password})
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token)
    }

    // ------------- logout
    const logout = async () => {
        await api.post("/logout");
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{user, token, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}






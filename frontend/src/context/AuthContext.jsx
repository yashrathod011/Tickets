import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial check for user in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            const { token, user: userData } = res.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Something went wrong';
            setError(message);
            return { success: false, message };
        }
    };

    const register = async (name, email, password) => {
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
            const { token, user: userData } = res.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

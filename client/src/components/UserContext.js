import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthProvider';
 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { userId } = useAuth(); 
    const [currentUser, setCurrentUser] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchUser = async (id) => {
        if (!id) return; 

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("auth:", response.data);
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching current user', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(userId);
    }, [userId]); 

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, fetchUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
const UserContext = createContext()
export const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({})

    const fetchUser = async () => {
        const id = localStorage.getItem('userId')
        try {
            const token = localStorage.getItem('token')
            const response = await api.get(`users/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            setCurrentUser(response.data)
            
        } catch (error) {
            console.error('error fetching current user', error);
            
        }
    }
    useEffect(() => {
        const id = localStorage.getItem('userId')
        if (id) {
            fetchUser()
        }
    }, [])
  return (
    <UserContext.Provider value={{currentUser, setCurrentUser, fetchUser}}>
        {children}
    </UserContext.Provider>
  )
}
export const useUser = () => useContext(UserContext)

import React, { createContext, useContext, useEffect, useState } from 'react'
const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [isAuthenticated, setIsAuthenticated] = useState(!!token)

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true)
        }
        else {
            setIsAuthenticated(false)
        }
    }, [token])
    const login = (newToken) => {
        setToken(newToken)
        localStorage.setItem('token', newToken)
    }
    
    const logout = () => {
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
    }
  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)

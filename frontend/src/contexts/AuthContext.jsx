import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me')
            setUser(response.data.data)
        } catch (error) {
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (identifier, password) => {
        const response = await api.post('/auth/login', { identifier, password })
        const { token, user } = response.data.data
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        return response.data
    }

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData)
        const { token, user } = response.data.data
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        return response.data
    }

    const logout = () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        fetchUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axiosInstance"
import { useTheme } from "../hooks/useTheme"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/profile")
          setUser(res.data)
        } catch (err) {
          console.error("Error loading user:", err)
          logout()
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (userData) => {
    try {
      setError(null)
      const res = await api.post("/auth/signup", userData)
      setToken(res.data.token)
      setUser(res.data)
      localStorage.setItem("token", res.data.token)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      return false
    }
  }

  // Login user
  const login = async (credentials) => {
    try {
      setError(null)
      const res = await api.post("/auth/login", credentials)
      setToken(res.data.token)
      setUser(res.data)
      localStorage.setItem("token", res.data.token)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return false
    }
  }

  // Logout user
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    navigate("/login")
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null)
      const res = await api.put("/profile", profileData)
      setUser({ ...user, ...res.data })
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed")
      return false
    }
  }

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setError(null)
      await api.put("/profile/password", passwordData)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed")
      return false
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    token,
    loading,
    error,
    theme,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    clearError,
    toggleTheme,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

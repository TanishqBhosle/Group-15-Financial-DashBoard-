"use client"
import { Routes, Route } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"

// Pages
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ExpenseTracker from "./pages/ExpenseTracker"
import InvestmentPlanner from "./pages/InvestmentPlanner"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  const { theme } = useAuth()

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex-grow bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/expenses" element={<PrivateRoute element={<ExpenseTracker />} />} />
            <Route path="/investments" element={<PrivateRoute element={<InvestmentPlanner />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App

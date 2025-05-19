"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { expenseAPI, incomeAPI } from "../api/endpoints"
import ExpenseChart from "../components/ExpenseChart"
import { motion } from "framer-motion"

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [expenseSummary, setExpenseSummary] = useState([])
  const [incomeSummary, setIncomeSummary] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [availableToInvest, setAvailableToInvest] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get current date info
        const now = new Date()
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()

        // Set date range for current month
        const startDate = new Date(currentYear, currentMonth, 1)
        const endDate = new Date(currentYear, currentMonth + 1, 0)

        // Format dates for API
        const startDateStr = startDate.toISOString().split("T")[0]
        const endDateStr = endDate.toISOString().split("T")[0]

        // Fetch expense summary
        const expenseRes = await expenseAPI.getExpenseSummary({
          startDate: startDateStr,
          endDate: endDateStr,
        })

        // Fetch income summary
        const incomeRes = await incomeAPI.getIncomeSummary({
          year: currentYear,
        })

        // Calculate total income for current month
        const currentMonthIncome = incomeRes.data.find((item) => new Date(item.month).getMonth() === currentMonth)

        const monthlyIncome = currentMonthIncome ? currentMonthIncome.total : 0

        // Calculate total expenses
        const monthlyExpenses = expenseRes.data.reduce((sum, item) => sum + item.total, 0)

        // Set state
        setExpenseSummary(expenseRes.data)
        setIncomeSummary(incomeRes.data)
        setTotalIncome(monthlyIncome)
        setTotalExpenses(monthlyExpenses)
        setAvailableToInvest(Math.max(0, monthlyIncome - monthlyExpenses))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Here's an overview of your financial health</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-2">Monthly Income</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">${totalIncome.toFixed(2)}</p>
          <Link
            to="/expenses"
            className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mt-4 inline-block"
          >
            Manage Income →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-2">Monthly Expenses</h2>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">${totalExpenses.toFixed(2)}</p>
          <Link
            to="/expenses"
            className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mt-4 inline-block"
          >
            Track Expenses →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-2">Available to Invest</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${availableToInvest.toFixed(2)}</p>
          <Link
            to="/investments"
            className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mt-4 inline-block"
          >
            Plan Investments →
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
        {expenseSummary.length > 0 ? (
          <ExpenseChart data={expenseSummary} />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No expense data for this month.</p>
            <Link
              to="/expenses"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mt-2 inline-block"
            >
              Add your first expense →
            </Link>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              to="/expenses"
              className="block w-full py-2 px-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              Add New Expense
            </Link>
            <Link
              to="/expenses"
              className="block w-full py-2 px-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Record Income
            </Link>
            <Link
              to="/investments"
              className="block w-full py-2 px-4 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              Update Investment Plan
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Financial Tips</h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Aim to save at least 20% of your monthly income</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Track your daily expenses to identify spending patterns</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Diversify your investments to minimize risk</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Set up automatic transfers to your savings account</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { expenseAPI, incomeAPI } from "../api/endpoints"
import InvestmentChart from "../components/InvestmentChart"
import CommentBox from "../components/CommentBox"
import { commentAPI } from "../api/endpoints"
import { motion } from "framer-motion"

const InvestmentPlanner = () => {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [availableToInvest, setAvailableToInvest] = useState(0)
  const [riskLevel, setRiskLevel] = useState(user?.riskTolerance || "medium")
  const [investmentAllocation, setInvestmentAllocation] = useState([])
  const [comments, setComments] = useState([])
  const [investmentSuggestions, setInvestmentSuggestions] = useState([])

  // Investment types and their allocation percentages based on risk level
  const riskAllocations = {
    low: {
      "Mutual Funds": 40,
      SIPs: 30,
      FDs: 20,
      Stocks: 5,
      Crypto: 5,
    },
    medium: {
      "Mutual Funds": 30,
      SIPs: 25,
      FDs: 15,
      Stocks: 20,
      Crypto: 10,
    },
    high: {
      "Mutual Funds": 20,
      SIPs: 15,
      FDs: 5,
      Stocks: 35,
      Crypto: 25,
    },
  }

  // Sample investment suggestions
  const sampleInvestments = {
    low: [
      {
        id: "low1",
        name: "Conservative Growth Fund",
        type: "Mutual Funds",
        riskLevel: "low",
        returns: { oneYear: 6, fiveYear: 8, tenYear: 10 },
        description: "A low-risk fund focused on stable companies with consistent dividend payouts.",
      },
      {
        id: "low2",
        name: "Blue Chip SIP",
        type: "SIPs",
        riskLevel: "low",
        returns: { oneYear: 7, fiveYear: 9, tenYear: 11 },
        description: "Systematic investment in established companies with strong market positions.",
      },
      {
        id: "low3",
        name: "Fixed Deposit Plus",
        type: "FDs",
        riskLevel: "low",
        returns: { oneYear: 5, fiveYear: 6, tenYear: 7 },
        description: "Higher interest rates than regular savings with guaranteed returns.",
      },
    ],
    medium: [
      {
        id: "med1",
        name: "Balanced Growth Fund",
        type: "Mutual Funds",
        riskLevel: "medium",
        returns: { oneYear: 9, fiveYear: 12, tenYear: 15 },
        description: "A balanced approach with a mix of stable and growth-oriented investments.",
      },
      {
        id: "med2",
        name: "Mid-Cap SIP",
        type: "SIPs",
        riskLevel: "medium",
        returns: { oneYear: 10, fiveYear: 14, tenYear: 16 },
        description: "Systematic investment in mid-sized companies with growth potential.",
      },
      {
        id: "med3",
        name: "Tech Giants ETF",
        type: "Stocks",
        riskLevel: "medium",
        returns: { oneYear: 12, fiveYear: 15, tenYear: 18 },
        description: "A collection of established technology companies with strong market positions.",
      },
    ],
    high: [
      {
        id: "high1",
        name: "Aggressive Growth Fund",
        type: "Mutual Funds",
        riskLevel: "high",
        returns: { oneYear: 14, fiveYear: 18, tenYear: 22 },
        description: "High-risk, high-reward fund focused on emerging markets and sectors.",
      },
      {
        id: "high2",
        name: "Small-Cap SIP",
        type: "SIPs",
        riskLevel: "high",
        returns: { oneYear: 15, fiveYear: 20, tenYear: 25 },
        description: "Systematic investment in small companies with high growth potential.",
      },
      {
        id: "high3",
        name: "Bitcoin & Ethereum Mix",
        type: "Crypto",
        riskLevel: "high",
        returns: { oneYear: 25, fiveYear: 30, tenYear: 35 },
        description: "A balanced mix of established cryptocurrencies for long-term growth.",
      },
    ],
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Update investment allocation when risk level or available amount changes
    calculateInvestmentAllocation()
    // Update investment suggestions based on risk level
    setInvestmentSuggestions(sampleInvestments[riskLevel] || [])
  }, [riskLevel, availableToInvest])

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

      // Calculate available to invest
      const available = Math.max(0, monthlyIncome - monthlyExpenses)
      setAvailableToInvest(available)

      // Fetch comments
      const commentsRes = await commentAPI.getComments()
      setComments(commentsRes.data)

      // Set risk level from user profile
      if (user?.riskTolerance) {
        setRiskLevel(user.riskTolerance)
      }
    } catch (error) {
      console.error("Error fetching investment data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateInvestmentAllocation = () => {
    const allocation = riskAllocations[riskLevel] || riskAllocations.medium

    // Calculate amount for each investment type
    const investmentData = Object.entries(allocation).map(([name, percentage]) => {
      const value = (availableToInvest * percentage) / 100
      return { name, value }
    })

    setInvestmentAllocation(investmentData)
  }

  const handleRiskLevelChange = async (level) => {
    setRiskLevel(level)

    // Update user profile with new risk tolerance
    try {
      await updateProfile({ riskTolerance: level })
    } catch (error) {
      console.error("Error updating risk tolerance:", error)
    }
  }

  const handleCommentSubmit = async (text) => {
    try {
      await commentAPI.createComment({ text })
      // Refresh comments
      const commentsRes = await commentAPI.getComments()
      setComments(commentsRes.data)
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

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
        <h1 className="text-3xl font-bold">Investment Planner</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Plan and optimize your investments based on your risk tolerance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-2">Available to Invest</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">${availableToInvest.toFixed(2)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This is your remaining budget after expenses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Risk Tolerance</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleRiskLevelChange("low")}
              className={`px-4 py-2 rounded-md ${
                riskLevel === "low"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Low Risk
            </button>
            <button
              onClick={() => handleRiskLevelChange("medium")}
              className={`px-4 py-2 rounded-md ${
                riskLevel === "medium"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Medium Risk
            </button>
            <button
              onClick={() => handleRiskLevelChange("high")}
              className={`px-4 py-2 rounded-md ${
                riskLevel === "high"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              High Risk
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {riskLevel === "low" && "Conservative approach with stable returns and lower risk."}
              {riskLevel === "medium" && "Balanced approach with moderate growth potential and risk."}
              {riskLevel === "high" && "Aggressive approach with higher growth potential and risk."}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Investment Allocation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <InvestmentChart data={investmentAllocation} riskLevel={riskLevel} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Allocation Breakdown</h3>
            <div className="space-y-4">
              {investmentAllocation.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {riskAllocations[riskLevel][item.name]}% of portfolio
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">${item.value.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Investment Suggestions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investmentSuggestions.map((investment) => (
            <div
              key={investment.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{investment.name}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{investment.type}</div>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span>1 Year Return:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{investment.returns.oneYear}%</span>
                </div>
                <div className="flex justify-between">
                  <span>5 Year Return:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{investment.returns.fiveYear}%</span>
                </div>
                <div className="flex justify-between">
                  <span>10 Year Return:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{investment.returns.tenYear}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{investment.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Investment Discussion</h2>
        <div className="mb-6">
          <CommentBox
            onSubmit={handleCommentSubmit}
            placeholder="Share your thoughts or ask questions about investments..."
            buttonText="Post Comment"
          />
        </div>

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="font-medium">{comment.user?.name || "Anonymous"}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(comment.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default InvestmentPlanner

"use client"

import { useState, useEffect } from "react"
import { expenseAPI, incomeAPI } from "../api/endpoints"
import ExpenseChart from "../components/ExpenseChart"
import { motion } from "framer-motion"
import CategoryIcon from "../components/CategoryIcons"

const ExpenseTracker = () => {
  const [activeTab, setActiveTab] = useState("expenses")
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [expenseSummary, setExpenseSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    // Expense form
    expenseCategory: "Food",
    expenseAmount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    expenseDescription: "",

    // Income form
    incomeAmount: "",
    incomeSource: "",
    incomeMonth: new Date().toISOString().split("T")[0].substring(0, 7),
    incomeDescription: "",
  })
  const [formErrors, setFormErrors] = useState({})

  const expenseCategories = [
    "Food",
    "Rent",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Education",
    "Shopping",
    "Other",
  ]

  useEffect(() => {
    fetchData()
  }, [])

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

      // Fetch expenses
      const expenseRes = await expenseAPI.getExpenses({
        startDate: startDateStr,
        endDate: endDateStr,
      })

      // Fetch expense summary
      const expenseSummaryRes = await expenseAPI.getExpenseSummary({
        startDate: startDateStr,
        endDate: endDateStr,
      })

      // Fetch income
      const incomeRes = await incomeAPI.getIncome({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })

      // Set state
      setExpenses(expenseRes.data)
      setExpenseSummary(expenseSummaryRes.data)
      setIncome(incomeRes.data)
    } catch (error) {
      console.error("Error fetching expense data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const validateExpenseForm = () => {
    const errors = {}

    if (!formData.expenseAmount) {
      errors.expenseAmount = "Amount is required"
    } else if (isNaN(formData.expenseAmount) || Number.parseFloat(formData.expenseAmount) <= 0) {
      errors.expenseAmount = "Amount must be a positive number"
    }

    if (!formData.expenseDate) {
      errors.expenseDate = "Date is required"
    }

    return errors
  }

  const validateIncomeForm = () => {
    const errors = {}

    if (!formData.incomeAmount) {
      errors.incomeAmount = "Amount is required"
    } else if (isNaN(formData.incomeAmount) || Number.parseFloat(formData.incomeAmount) <= 0) {
      errors.incomeAmount = "Amount must be a positive number"
    }

    if (!formData.incomeSource) {
      errors.incomeSource = "Source is required"
    }

    if (!formData.incomeMonth) {
      errors.incomeMonth = "Month is required"
    }

    return errors
  }

  const handleExpenseSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const errors = validateExpenseForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      await expenseAPI.createExpense({
        category: formData.expenseCategory,
        amount: Number.parseFloat(formData.expenseAmount),
        date: formData.expenseDate,
        description: formData.expenseDescription,
      })

      // Reset form
      setFormData({
        ...formData,
        expenseAmount: "",
        expenseDate: new Date().toISOString().split("T")[0],
        expenseDescription: "",
      })

      // Refresh data
      fetchData()
    } catch (error) {
      console.error("Error creating expense:", error)
    }
  }

  const handleIncomeSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const errors = validateIncomeForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      await incomeAPI.createIncome({
        amount: Number.parseFloat(formData.incomeAmount),
        source: formData.incomeSource,
        month: `${formData.incomeMonth}-01`,
        description: formData.incomeDescription,
      })

      // Reset form
      setFormData({
        ...formData,
        incomeAmount: "",
        incomeSource: "",
        incomeDescription: "",
      })

      // Refresh data
      fetchData()
    } catch (error) {
      console.error("Error creating income:", error)
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      await expenseAPI.deleteExpense(id)
      fetchData()
    } catch (error) {
      console.error("Error deleting expense:", error)
    }
  }

  const handleDeleteIncome = async (id) => {
    try {
      await incomeAPI.deleteIncome(id)
      fetchData()
    } catch (error) {
      console.error("Error deleting income:", error)
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
        <h1 className="text-3xl font-bold">Financial Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your income and expenses</p>
      </motion.div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "expenses"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            }`}
            onClick={() => setActiveTab("expenses")}
          >
            Expenses
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "income"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            }`}
            onClick={() => setActiveTab("income")}
          >
            Income
          </button>
        </div>

        <div className="p-6">
          {activeTab === "expenses" ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
                  <form onSubmit={handleExpenseSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="expenseCategory"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Category
                      </label>
                      <select
                        id="expenseCategory"
                        name="expenseCategory"
                        value={formData.expenseCategory}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        {expenseCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="expenseAmount"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        id="expenseAmount"
                        name="expenseAmount"
                        value={formData.expenseAmount}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                          formErrors.expenseAmount ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors.expenseAmount && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.expenseAmount}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="expenseDate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="expenseDate"
                        name="expenseDate"
                        value={formData.expenseDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                          formErrors.expenseDate ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {formErrors.expenseDate && <p className="mt-1 text-sm text-red-600">{formErrors.expenseDate}</p>}
                    </div>

                    <div>
                      <label
                        htmlFor="expenseDescription"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Description (Optional)
                      </label>
                      <textarea
                        id="expenseDescription"
                        name="expenseDescription"
                        value={formData.expenseDescription}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Expense
                    </motion.button>
                  </form>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
                  <ExpenseChart data={expenseSummary} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
                {expenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {expenses.map((expense) => (
                          <tr key={expense._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              <span className="flex items-center gap-2">
  <CategoryIcon category={expense.category} size={24} />
  <span className="hidden xs:inline-block md:inline-block lg:inline-block">{expense.category}</span>
</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              ${expense.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {expense.description || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteExpense(expense._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No expenses recorded for this month.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Add New Income</h2>
                <form onSubmit={handleIncomeSubmit} className="max-w-md space-y-4">
                  <div>
                    <label
                      htmlFor="incomeAmount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      id="incomeAmount"
                      name="incomeAmount"
                      value={formData.incomeAmount}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        formErrors.incomeAmount ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.incomeAmount && <p className="mt-1 text-sm text-red-600">{formErrors.incomeAmount}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="incomeSource"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Source
                    </label>
                    <input
                      type="text"
                      id="incomeSource"
                      name="incomeSource"
                      value={formData.incomeSource}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        formErrors.incomeSource ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. Salary, Freelance, etc."
                    />
                    {formErrors.incomeSource && <p className="mt-1 text-sm text-red-600">{formErrors.incomeSource}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="incomeMonth"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Month
                    </label>
                    <input
                      type="month"
                      id="incomeMonth"
                      name="incomeMonth"
                      value={formData.incomeMonth}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                        formErrors.incomeMonth ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.incomeMonth && <p className="mt-1 text-sm text-red-600">{formErrors.incomeMonth}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="incomeDescription"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="incomeDescription"
                      name="incomeDescription"
                      value={formData.incomeDescription}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Income
                  </motion.button>
                </form>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Income History</h2>
                {income.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Source
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Month
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {income.map((item) => (
                          <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {item.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              ${item.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {new Date(item.month).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                              {item.description || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDeleteIncome(item._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No income recorded for this month.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpenseTracker

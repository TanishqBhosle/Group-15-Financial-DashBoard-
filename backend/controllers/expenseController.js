const asyncHandler = require("express-async-handler")
const Expense = require("../models/Expense")
const { isValidAmount } = require("../utils/validators")

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const { category, amount, date, description } = req.body

  // Validation
  if (!category || !amount) {
    res.status(400)
    throw new Error("Please add category and amount")
  }

  if (!isValidAmount(amount)) {
    res.status(400)
    throw new Error("Amount must be a positive number")
  }

  // Create expense
  const expense = await Expense.create({
    user: req.user._id,
    category,
    amount,
    date: date || Date.now(),
    description,
  })

  res.status(201).json(expense)
})

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const { startDate, endDate, category } = req.query

  const query = { user: req.user._id }

  // Add date filter if provided
  if (startDate || endDate) {
    query.date = {}
    if (startDate) query.date.$gte = new Date(startDate)
    if (endDate) query.date.$lte = new Date(endDate)
  }

  // Add category filter if provided
  if (category) {
    query.category = category
  }

  const expenses = await Expense.find(query).sort({ date: -1 })

  res.json(expenses)
})

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id)

  if (!expense) {
    res.status(404)
    throw new Error("Expense not found")
  }

  // Check if expense belongs to user
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  res.json(expense)
})

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const { category, amount, date, description } = req.body

  // Find expense
  const expense = await Expense.findById(req.params.id)

  if (!expense) {
    res.status(404)
    throw new Error("Expense not found")
  }

  // Check if expense belongs to user
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  // Validate amount if provided
  if (amount && !isValidAmount(amount)) {
    res.status(400)
    throw new Error("Amount must be a positive number")
  }

  // Update expense
  expense.category = category || expense.category
  expense.amount = amount || expense.amount
  expense.date = date || expense.date
  expense.description = description !== undefined ? description : expense.description

  const updatedExpense = await expense.save()

  res.json(updatedExpense)
})

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id)

  if (!expense) {
    res.status(404)
    throw new Error("Expense not found")
  }

  // Check if expense belongs to user
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  await expense.deleteOne()

  res.json({ message: "Expense removed" })
})

// @desc    Get expense summary by category
// @route   GET /api/expenses/summary
// @access  Private
const getExpenseSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query

  const matchStage = { user: req.user._id }

  // Add date filter if provided
  if (startDate || endDate) {
    matchStage.date = {}
    if (startDate) matchStage.date.$gte = new Date(startDate)
    if (endDate) matchStage.date.$lte = new Date(endDate)
  }

  const summary = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ])

  res.json(summary)
})

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
}

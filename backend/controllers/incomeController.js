const asyncHandler = require("express-async-handler")
const Income = require("../models/Income")
const { isValidAmount } = require("../utils/validators")

// @desc    Create a new income
// @route   POST /api/income
// @access  Private
const createIncome = asyncHandler(async (req, res) => {
  const { amount, source, month, description } = req.body

  // Validation
  if (!amount || !source || !month) {
    res.status(400)
    throw new Error("Please add amount, source, and month")
  }

  if (!isValidAmount(amount)) {
    res.status(400)
    throw new Error("Amount must be a positive number")
  }

  // Create income
  const income = await Income.create({
    user: req.user._id,
    amount,
    source,
    month: new Date(month),
    description,
  })

  res.status(201).json(income)
})

// @desc    Get all income for a user
// @route   GET /api/income
// @access  Private
const getIncome = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query

  const query = { user: req.user._id }

  // Add date filter if provided
  if (startDate || endDate) {
    query.month = {}
    if (startDate) query.month.$gte = new Date(startDate)
    if (endDate) query.month.$lte = new Date(endDate)
  }

  const income = await Income.find(query).sort({ month: -1 })

  res.json(income)
})

// @desc    Get income by ID
// @route   GET /api/income/:id
// @access  Private
const getIncomeById = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id)

  if (!income) {
    res.status(404)
    throw new Error("Income not found")
  }

  // Check if income belongs to user
  if (income.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  res.json(income)
})

// @desc    Update income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = asyncHandler(async (req, res) => {
  const { amount, source, month, description } = req.body

  // Find income
  const income = await Income.findById(req.params.id)

  if (!income) {
    res.status(404)
    throw new Error("Income not found")
  }

  // Check if income belongs to user
  if (income.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  // Validate amount if provided
  if (amount && !isValidAmount(amount)) {
    res.status(400)
    throw new Error("Amount must be a positive number")
  }

  // Update income
  income.amount = amount || income.amount
  income.source = source || income.source
  income.month = month ? new Date(month) : income.month
  income.description = description !== undefined ? description : income.description

  const updatedIncome = await income.save()

  res.json(updatedIncome)
})

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id)

  if (!income) {
    res.status(404)
    throw new Error("Income not found")
  }

  // Check if income belongs to user
  if (income.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  await income.deleteOne()

  res.json({ message: "Income removed" })
})

// @desc    Get total income by month
// @route   GET /api/income/summary
// @access  Private
const getIncomeSummary = asyncHandler(async (req, res) => {
  const { year } = req.query

  const matchStage = { user: req.user._id }

  // Add year filter if provided
  if (year) {
    const startDate = new Date(`${year}-01-01`)
    const endDate = new Date(`${year}-12-31`)
    matchStage.month = { $gte: startDate, $lte: endDate }
  }

  const summary = await Income.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { $month: "$month" },
        month: { $first: "$month" },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ])

  res.json(summary)
})

module.exports = {
  createIncome,
  getIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
  getIncomeSummary,
}

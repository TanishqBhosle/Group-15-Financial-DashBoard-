const express = require("express")
const router = express.Router()
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require("../controllers/expenseController")
const { protect } = require("../middleware/authMiddleware")

// All routes are protected
router.use(protect)

router.route("/").post(createExpense).get(getExpenses)

router.route("/summary").get(getExpenseSummary)

router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense)

module.exports = router

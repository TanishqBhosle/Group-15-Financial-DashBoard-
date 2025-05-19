const express = require("express")
const router = express.Router()
const {
  createIncome,
  getIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
  getIncomeSummary,
} = require("../controllers/incomeController")
const { protect } = require("../middleware/authMiddleware")

// All routes are protected
router.use(protect)

router.route("/").post(createIncome).get(getIncome)

router.route("/summary").get(getIncomeSummary)

router.route("/:id").get(getIncomeById).put(updateIncome).delete(deleteIncome)

module.exports = router

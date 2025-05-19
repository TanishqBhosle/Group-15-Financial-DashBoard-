const mongoose = require("mongoose")

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: [
        "Food",
        "Rent",
        "Transportation",
        "Entertainment",
        "Utilities",
        "Healthcare",
        "Education",
        "Shopping",
        "Other",
      ],
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: [0, "Amount must be positive"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const Expense = mongoose.model("Expense", expenseSchema)

module.exports = Expense

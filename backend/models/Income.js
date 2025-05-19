const mongoose = require("mongoose")

const incomeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: [0, "Amount must be positive"],
    },
    source: {
      type: String,
      required: [true, "Please add a source"],
      trim: true,
    },
    month: {
      type: Date,
      required: [true, "Please add a month"],
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

const Income = mongoose.model("Income", incomeSchema)

module.exports = Income

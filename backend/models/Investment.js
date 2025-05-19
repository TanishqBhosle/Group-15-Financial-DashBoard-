const mongoose = require("mongoose")

const investmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Please add a type"],
      enum: ["Mutual Funds", "SIPs", "FDs", "Stocks", "Crypto"],
    },
    riskLevel: {
      type: String,
      required: [true, "Please add a risk level"],
      enum: ["low", "medium", "high"],
    },
    returns: {
      oneYear: {
        type: Number,
        required: [true, "Please add 1 year returns"],
      },
      fiveYear: {
        type: Number,
        required: [true, "Please add 5 year returns"],
      },
      tenYear: {
        type: Number,
        required: [true, "Please add 10 year returns"],
      },
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

const Investment = mongoose.model("Investment", investmentSchema)

module.exports = Investment

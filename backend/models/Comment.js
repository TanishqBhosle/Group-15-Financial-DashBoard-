const mongoose = require("mongoose")

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Please add a comment"],
      trim: true,
    },
    investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment

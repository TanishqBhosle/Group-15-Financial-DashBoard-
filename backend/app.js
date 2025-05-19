const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { errorHandler } = require("./middleware/errorHandler")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/income", require("./routes/incomeRoutes"))
app.use("/api/expenses", require("./routes/expenseRoutes"))
app.use("/api/comments", require("./routes/commentRoutes"))
app.use("/api/profile", require("./routes/profileRoutes"))

// Base route
app.get("/", (req, res) => {
  res.send("GroWise API is running...")
})

// Error handler
app.use(errorHandler)

module.exports = app

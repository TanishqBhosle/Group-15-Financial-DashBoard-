const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")
const connectDB = require("./config/db")
const { errorHandler } = require("./middleware/errorHandler")

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

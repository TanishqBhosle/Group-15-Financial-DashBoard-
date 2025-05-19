const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const generateToken = require("../utils/generateToken")
const { isValidEmail, isValidPassword } = require("../utils/validators")

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please add all fields")
  }

  if (!isValidEmail(email)) {
    res.status(400)
    throw new Error("Please enter a valid email")
  }

  if (!isValidPassword(password)) {
    res.status(400)
    throw new Error("Password must be at least 6 characters and contain at least one letter and one number")
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      riskTolerance: user.riskTolerance,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      riskTolerance: user.riskTolerance,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      riskTolerance: user.riskTolerance,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
}

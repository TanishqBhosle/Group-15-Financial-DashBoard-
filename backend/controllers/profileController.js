const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const { isValidEmail, isValidPassword } = require("../utils/validators")

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password")

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, bio, riskTolerance } = req.body

  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Validate email if provided
  if (email && !isValidEmail(email)) {
    res.status(400)
    throw new Error("Please enter a valid email")
  }

  // Check if email is already taken
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      res.status(400)
      throw new Error("Email already in use")
    }
  }

  // Update user fields
  user.name = name || user.name
  user.email = email || user.email
  user.bio = bio !== undefined ? bio : user.bio
  user.riskTolerance = riskTolerance || user.riskTolerance

  const updatedUser = await user.save()

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    bio: updatedUser.bio,
    riskTolerance: updatedUser.riskTolerance,
  })
})

// @desc    Update user password
// @route   PUT /api/profile/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    res.status(400)
    throw new Error("Please provide current and new password")
  }

  // Validate new password
  if (!isValidPassword(newPassword)) {
    res.status(400)
    throw new Error("Password must be at least 6 characters and contain at least one letter and one number")
  }

  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  // Check if current password is correct
  const isMatch = await user.matchPassword(currentPassword)
  if (!isMatch) {
    res.status(401)
    throw new Error("Current password is incorrect")
  }

  // Update password
  user.password = newPassword
  await user.save()

  res.json({ message: "Password updated successfully" })
})

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
}

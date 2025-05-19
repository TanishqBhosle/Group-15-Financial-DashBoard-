const asyncHandler = require("express-async-handler")
const Comment = require("../models/Comment")

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { text, investment } = req.body

  // Validation
  if (!text) {
    res.status(400)
    throw new Error("Please add a comment text")
  }

  // Create comment
  const comment = await Comment.create({
    user: req.user._id,
    text,
    investment,
    date: Date.now(),
  })

  // Populate user info
  const populatedComment = await Comment.findById(comment._id)
    .populate("user", "name")
    .populate("investment", "name type")

  res.status(201).json(populatedComment)
})

// @desc    Get all comments
// @route   GET /api/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const { investment } = req.query

  const query = {}

  // Add investment filter if provided
  if (investment) {
    query.investment = investment
  }

  const comments = await Comment.find(query)
    .populate("user", "name")
    .populate("investment", "name type")
    .sort({ date: -1 })

  res.json(comments)
})

// @desc    Get comment by ID
// @route   GET /api/comments/:id
// @access  Private
const getCommentById = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate("user", "name").populate("investment", "name type")

  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  res.json(comment)
})

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body

  // Find comment
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  // Check if comment belongs to user
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  // Update comment
  comment.text = text || comment.text
  comment.date = Date.now()

  const updatedComment = await comment.save()

  // Populate user info
  const populatedComment = await Comment.findById(updatedComment._id)
    .populate("user", "name")
    .populate("investment", "name type")

  res.json(populatedComment)
})

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(404)
    throw new Error("Comment not found")
  }

  // Check if comment belongs to user
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized")
  }

  await comment.deleteOne()

  res.json({ message: "Comment removed" })
})

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
}

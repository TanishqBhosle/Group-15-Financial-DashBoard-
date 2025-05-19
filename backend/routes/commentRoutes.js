const express = require("express")
const router = express.Router()
const {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controllers/commentController")
const { protect } = require("../middleware/authMiddleware")

// All routes are protected
router.use(protect)

router.route("/").post(createComment).get(getComments)

router.route("/:id").get(getCommentById).put(updateComment).delete(deleteComment)

module.exports = router

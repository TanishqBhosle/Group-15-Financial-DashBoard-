const express = require("express")
const router = express.Router()
const { getProfile, updateProfile, updatePassword } = require("../controllers/profileController")
const { protect } = require("../middleware/authMiddleware")

// All routes are protected
router.use(protect)

router.route("/").get(getProfile).put(updateProfile)

router.route("/password").put(updatePassword)

module.exports = router

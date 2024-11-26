import express from "express"
import { login, logout, signup, updateProfile, checkAuth, createotp, verifyotp } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/createotp", createotp)
router.post("/verifyotp", verifyotp)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.put("/update-profile", protectRoute, updateProfile)
router.get("/check", protectRoute, checkAuth)

export default router
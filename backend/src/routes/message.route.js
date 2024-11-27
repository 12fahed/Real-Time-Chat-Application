import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessage, addNewNumber } from "../controllers/message.controller.js"
const router = express.Router()

router.get("/users", protectRoute, getUsersForSidebar)
router.post("/addnewnumber", protectRoute, addNewNumber)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)
export default router  
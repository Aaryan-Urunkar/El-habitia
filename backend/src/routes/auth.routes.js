import express from "express"
import { login, logout, signup , updateProfile , checkAuth, addPersonality } from "../controllers/auth.controller.js"
// import { protectRoute } from "../middleware/auth.middleware.js"
const router = express.Router()

router.post("/signup" , signup)

router.post("/login" , login)

router.post("/logout" , logout)

router.put("/update-profile" , updateProfile)

router.post("/personality" , addPersonality)

router.get("/check" ,  checkAuth)

export default router
import express from "express"
import { createHabit, deleteHabit, getHabit, getHabitsOfUser, trackHabit } from "../controllers/habit.controller.js"
const router = express.Router()

router.post("/create-habit" , createHabit)

router.post("/track-habit/:title" , trackHabit)

router.get("/get-habit/:title" , getHabit)

router.get("/get-habits" , getHabitsOfUser)

router.delete("/delete-habit/:title" , deleteHabit)

export default router
import express from "express"
import { createHabit, deleteHabit, getHabit, trackHabit } from "../controllers/habit.controller.js"
const router = express.Router()

router.post("/create-habit" , createHabit)

router.post("/track-habit" , trackHabit)

router.get("/get-habit/:title" , getHabit)

router.delete("/delete-habit/:title" , deleteHabit)

export default router
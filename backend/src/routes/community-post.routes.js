import express from "express"
import { getAllCommunityMessages, sendMessage } from "../controllers/community-posts.controller.js"
const router = express.Router()

router.get("/get-messages" , getAllCommunityMessages)
router.post("/upload-community-post" , sendMessage)

export default router
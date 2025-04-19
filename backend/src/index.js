import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js"
import {app , server} from "./lib/socket.js"
import community_post_router from "./routes/community-post.routes.js"
import auth_router from "./routes/auth.routes.js"
import habit_router from "./routes/habit.routes.js"
dotenv.config()

const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin : "*",
    credentials : true 
}))

app.use("/api/auth" , auth_router)
app.use("/api/community-post" , community_post_router)
app.use("/api/habit" , habit_router)

server.listen(PORT, () =>{
    console.log("Server is running on port " + PORT)
    connectDB()
})
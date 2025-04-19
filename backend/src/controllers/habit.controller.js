import { Habit } from "../models/habit.model.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
export const createHabit = async(req, res) => {

    //From request, expect token and habit data

    const {token} = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.find({_id : payload.userId})
        if(!user){
            return res.status(500).json({msg : "No user found"})
        }
        const {title , description, isNegative} = req.body

        const habit = await Habit.findOne({user: user._id , title})
        if(habit){
            return res.status(400).json({msg : "User already has same habit title"})
        }

        const newHabit = await Habit.create({
            user : user._id,
            title,
            description,
            isNegative, //Expects a boolean value
        })
        if(!newHabit){
            return res.status(500).json({msg : "Unable to create new habit"})
        }
        return res.status(200).json({msg : "New habit created" , newHabit})
    }catch(e){
        return res.status(500).json({msg:"Internal server error OR jwt fail"})
    }
    
}


export const trackHabit = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const { title : habitTitle } = req.params
    const habit = await Habit.findOne({ title: habitTitle, user: userId })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })

    const now = new Date()
    const lastTracked = habit.lastTracked || habit.createdAt
    const daysDiff = Math.floor((now - lastTracked) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
      habit.tracked.push(1)
      habit.streak += 1
    } else if (daysDiff > 1) {
      habit.tracked.push(1)
      habit.streak = 1
    } else if (daysDiff === 0) {
      return res.status(400).json({ message: 'Already tracked today' })
    }

    habit.lastTracked = now
    await habit.save()

    res.json({ message: 'Habit tracked', streak: habit.streak })

  } catch (err) {
    res.status(401).json({ message: 'Invalid token OR internal server error' })
  }
}

export const getHabit = async(req , res) =>{
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
        const {title}= req.params
        if(!title){
            return res.status(400).json({msg : "No title passed"})
        }
        const habit = await Habit.findOne({user: userId , title})
    }catch(e){
        res.status(500).json({ message: 'Invalid token OR internal server error' })
    }
}

export const deleteHabit = async(req , res) =>{
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const userId = decoded.id
            const {title}= req.params
            const habit = await Habit.findOne({_id : userId , title})
            if(!habit){
                return res.json({msg : "Habit already does not exist!"})
            }
            await Habit.deleteOne({_id : habit._id })
            return res.json({msg : "Document successfully deleted" , habit})
        } catch (error) {
            return res.status(500).json({msg : "Internal server error"})
        }
}
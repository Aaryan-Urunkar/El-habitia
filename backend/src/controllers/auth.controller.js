import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import {User} from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async(req , res)=>{
    try{
        const {name , email , password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({message : "all fields are required"})
        }
        //hash passwords
        if(password.length < 6){
            return res.status(400).json({message : "MINIMUM 6 characters for password"})
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message : "MINIMUM 6 characters for password"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password , salt)

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        })
        if(newUser){
            //generate jwt token here
            const token = generateToken(newUser._id , res)
            await newUser.save()
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.name,
                email : newUser.email,
                profilePic : newUser.profilePic,
                token : token
            })
        } else{
            res.status(400).json({message:"Invalid user data"})
        }

    } catch(error){
        res.status(500).json({message : "Internal error"})
    }
}

export const login = async(req , res) =>{
    const {email , password} = req.body
    try{
        
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({message : "Invalid credentials"})
        }
        
        const isPasswordCorrect = await bcrypt.compare(password , user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid credentials"})
        }
        console.log("In here");

        const token = generateToken(user._id , res)

        res.status(200).json({
            id:user._id,
            fullName: user.fullName,
            email:user.email,
            profilePic : user.profilePic, 
            token:token
        })
    }catch(e){
        console.log("Error in login controller");
        res.status(500).json({message : "Internal server error"})
    }
}

export const addPersonality= async(req , res) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        const userId = decoded.userId
        const {procrastinationResponse, sleepResponse, alcoholSmokingResponse} = req.body
        if(!procrastinationResponse || !sleepResponse || !alcoholSmokingResponse){
            return res.status(400).json({msg : "Fill all 3 fields"})
        }
        const user = await User.findOne({_id : userId})
        if(!user){
            return res.status(400).json({msg : "No user found"})
        }
        user.procrastinationResponse = procrastinationResponse
        user.sleepResponse = sleepResponse
        user.alcoholSmokingResponse = alcoholSmokingResponse
        user.save()
        return res.status(200).json({msg : "User updated" , user})
    }catch(e){
        return res.status(500).json({msg : "Internal server error"})
    }

}


export const logout = (req , res) =>{
    try{
        res.status(200).json({message : "Logged out successfully"})
    } catch(e){
        console.log("Error in logout controller");
        res.status(500).json({message : "Internal server error"})
    }
}

export const updateProfile = async(req , res) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {profilePic} = req.body
        const userId = decoded.userId

        if(!profilePic){
            return res.status(400).json({message : "Profile pic not provided"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId , {
            profilePic:uploadResponse.secure_url
        } , {new : true})

        res.status(200).json(updatedUser)
    }catch(E){
        res.status(500).json({message : "Internal server error"})
    }
}

export const checkAuth = async(req , res) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.status(200).json(decoded.userId);
    } catch(e){
        console.log("Error in checkAuth controller" , error.message);
        res.status(500).json({message : "Internal server error"})
        
    }
}
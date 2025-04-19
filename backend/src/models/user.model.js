import { Schema, model, Types } from 'mongoose'

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google
  profilePic:{
    type:String
  },
  procrastinationResponse: {
    type : String,
  },
  sleepResponse:{
    type:String
  },
  alcoholSmokingResponse : {
    type:String,
  },
  
  habits: [{ type: [String] }],
  dailyBoostCompleted: { type: Number, default: 0 },
  mode: { type: String, enum: ['growth', 'action'], default: 'growth' },

  createdAt: { type: Date, default: Date.now }
})

export const User = model('User', userSchema)
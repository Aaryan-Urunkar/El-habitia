import { Schema, model, Types } from 'mongoose'

const habitLogSchema = new Schema({
  habit: { type: Types.ObjectId, ref: 'Habit', required: true },
  user: { type: Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['completed', 'missed', 'skipped'], required: true }
})

export const HabitLog = model('HabitLog', habitLogSchema)

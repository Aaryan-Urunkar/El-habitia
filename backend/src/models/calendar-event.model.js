import { Schema, model, Types } from 'mongoose'

const calendarEventSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  habit: { type: Types.ObjectId, ref: 'Habit' },
  title: String,
  date: Date,
  notes: String
})

export const CalendarEvent = model('CalendarEvent', calendarEventSchema)

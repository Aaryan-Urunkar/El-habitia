import { Schema, model, Types } from 'mongoose'

// const habitSchema = new Schema({
//   user: { type: Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   description: String,     
//   isNegative: {type : Boolean},
//   streak: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// })
const habitSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  isNegative: { type: Boolean },
  streak: { type: Number, default: 0 },
  tracked: [{ type: Number }], // array of 1s or 0s
  lastTracked: { type: Date }, // time of last habit check-in
  createdAt: { type: Date, default: Date.now }
});


export const Habit = model('Habit', habitSchema)

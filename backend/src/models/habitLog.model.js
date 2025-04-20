import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["missed", "completed", "skipped"],
    default: "completed"
  }
}, { timestamps: true });

export const HabitLog = mongoose.model("HabitLog", habitLogSchema);

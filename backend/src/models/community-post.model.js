import { Schema, model, Types } from 'mongoose'

const communityPostSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  content: { type: String, },
  picture : {type: String, default : ""},
  createdAt: { type: Date, default: Date.now }
})

export const CommunityPost = model('CommunityPost', communityPostSchema)

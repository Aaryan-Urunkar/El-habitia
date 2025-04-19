import { CommunityPost } from '../models/community-post.model.js'

export const getAllCommunityMessages = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: 1 }) // ascending
    res.json(posts)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const sendMessage = async(req , res) =>{

    
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.status(401).json({ message: 'Unauthorized' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {text , image} = req.body
        const senderId = decoded.userId
        
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new CommunityPost({
            user: senderId,
            content : text,
            picture: imageUrl
        })
        await newMessage.save()

        // todo : realtime functionality goes here

        res.status(201).json(newMessage)
    }catch(e){

    }
}
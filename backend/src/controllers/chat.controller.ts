import { Request, Response } from 'express';
import { Chat } from '../models/chat.model';

// Get all chats
const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({room: ''}).sort({ createdAt: -1 }); // Sort by createdAt field
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
};

// Get chat depending on room 
const getRoomChat = async (req: Request<{room: string}>, res: Response) =>{
  const roomNumber = req.params.room
  try{
    const chat = await Chat.find({room: roomNumber}).sort({createdAt: -1})
    if(chat.length === 0){
      res.status(200).json({message: "Chat empty"})
      return
    }
    res.status(200).json(chat)
  }catch(err){
    console.error(err)
    res.status(500).json({message: "Error fetching room chat"})
  }
}

export default {
  getAllChats,
  getRoomChat
}
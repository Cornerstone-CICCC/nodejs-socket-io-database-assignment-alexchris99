import express from 'express';
import chatController from '../controllers/chat.controller';

const chatRouter = express.Router();

// Get all chat messages
chatRouter.get('/', chatController.getAllChats);

// Get chat by Room
chatRouter.get("/:room",chatController.getRoomChat)

export default chatRouter;
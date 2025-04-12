import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server,) => {
  io.on('connection', (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);
  
    socket.on('Join room', async (data)=>{
      const {username, message, room} = data
      try{
        // save the person joining the group
        const chat = new Chat({username, message, room})
        await chat.save()

        // brodcast the message
        io.emit('sendMessage', chat);

      }catch(err){
        console.error('Error saving the chat', err)
      }
    })

    // Listen to 'sendMessage' event
    socket.on('sendMessage', async (data) => {
      const { username, message, room} = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message, room });
        await chat.save();

        // Broadcast the chat object to all connected clients via the newMessage event
        io.emit('sendMessage', chat);
        
        // For room-based broadcast
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });

    socket.on('Leave room', async (data)=>{
      const {username, message, room} = data
      try{
        // save the person who left the group
        const chat = new Chat({username, message, room})
        await chat.save()
        // brodcast the message
        io.emit('sendMessage', chat);
      }catch(err){
        console.error('Error saving the chat', err)
      }
    })
    // On disconnect
    socket.on('disconnect', () => {
      //console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;
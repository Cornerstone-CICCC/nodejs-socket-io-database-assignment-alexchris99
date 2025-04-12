"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        // On connect
        console.log(`User connected: ${socket.id}`);
        socket.on('Join room', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                // save the person joining the group
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                // brodcast the message
                io.emit('sendMessage', chat);
            }
            catch (err) {
                console.error('Error saving the chat', err);
            }
        }));
        // Listen to 'sendMessage' event
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                // Broadcast the chat object to all connected clients via the newMessage event
                io.emit('sendMessage', chat);
                // For room-based broadcast
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        socket.on('Leave room', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                // save the person who left the group
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                // brodcast the message
                io.emit('sendMessage', chat);
            }
            catch (err) {
                console.error('Error saving the chat', err);
            }
        }));
        // On disconnect
        socket.on('disconnect', () => {
            //console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.default = setupChatSocket;

import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

const userSocketMap = {}

io.on("connection", (socket) => {
    console.log("A User Connected", socket.id);
  
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
    // socket.on("userTyping", ({ fromId, toId }) => {
    //     console.log(`${fromId} is typing to ${toId}`);
    //     io.to(userSocketMap[toId]).emit("userTyping", { fromId });
    // });
      
    socket.on("userTyping", ({ fromId, toId }) => {
        console.log(`${fromId} is typing to ${toId}`);
        if (toId) {
          // User is actively typing
          io.to(userSocketMap[toId]).emit("userTyping", { fromId });
        } else {
          // User has stopped typing
          io.emit("userStoppedTyping", { fromId });
        }
    });
      
  
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
  

export { io, app, server }
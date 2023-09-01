const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const { Socket } = require('socket.io-client');
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (Socket)=> {
   console.log('socket id', Socket.id);
   Socket.on("join", ({ roomId, userId }) => {
      console.log(roomId,userId);
      userSocketMap[Socket.id] = userId;
      Socket.join(roomId);
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
          io.to(socketId).emit("joined", {
              clients,
              userId,
              socketId: Socket.id,
          });
      });
  });

  Socket.on("code-change", ({ roomId, code }) => {
      Socket.in(roomId).emit("code-change", { code });
  });

  Socket.on("sync-code", ({ socketId, code }) => {
      io.to(socketId).emit("code-change", { code });
  });

  Socket.on('disconnecting', () => {
      const rooms = [...Socket.rooms];
      rooms.forEach((roomId) => {
          Socket.in(roomId).emit("disconnected", {
              socketId: Socket.id,
              username: userSocketMap[Socket.id],
          });
      });
      delete userSocketMap[Socket.id];
      Socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{console.log("listening...")});

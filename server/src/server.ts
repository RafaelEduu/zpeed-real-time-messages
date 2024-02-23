import cors from "@fastify/cors";

import fastify from "fastify";
import { Server } from "socket.io";

import { friendsRoute } from "./routes/friends";

import { messagesRoute } from "./routes/messages";
import { usersRoute } from "./routes/users";

const app = fastify();

const io = new Server(app.server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// Mantém um mapa de usuários online
const onlineUsers = new Map();
let users: { userId: string; socketId: string }[] = [];

const removeUser = (socketId: any) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const addUser = (userId: string, socketId: string) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

// Evento de conexão do Socket.IO
io.on("connection", (socket) => {
  // Evento para adicionar usuário online
  socket.on("add-user", (userId) => {
    addUser(userId, socket.id);
    console.log(userId)
    io.emit("get-users", users);
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers)
  });

  // Evento de desconexão
  socket.on("disconnect", () => {
    // Remove usuário do mapa de usuários online

    for (const [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        console.log(onlineUsers, "desconectado")
        break; 
      }
    }

    removeUser(socket.id);
  });

  console.log(onlineUsers)

  socket.on(
    "send-msg",
    ({ userId, createdAt, content, friendsId, receiverId }) => {
      const receiverUserId = receiverId[0].id;
      const user = getUser(receiverUserId);
      const senderId = getUser(userId);
      const onlineReceiverVerfication = onlineUsers.get(receiverUserId);

      // send to message when the receiver user is online
      if (onlineReceiverVerfication) {
        io.to(user.socketId).emit("msg-recieve", {
          userId,
          createdAt,
          friendsId,
          content,
        });
      }
      console.log(content)
      // send to message for the sender user
      io.to(senderId.socketId).emit("msg-recieve", {
        userId,
        createdAt,
        friendsId,
        content,
      });
    }
  );
});

app.register(messagesRoute);
app.register(friendsRoute);
app.register(usersRoute);
app.register(cors, {
  origin: ["http://localhost:3000"],
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("Server Running"));

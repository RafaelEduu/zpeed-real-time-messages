import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { api } from "../lib/api";

export async function WebSocket(app: FastifyInstance) {
  const io = new Server(app.server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  // Mantém um mapa de usuários online
  const onlineUsers = new Map();
  let users: { userId: string; socketId: string, accessToken: string }[] = [];

  const removeUser = (socketId: any) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const addUser = (userId: string, socketId: string, accessToken: string) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId, accessToken });
  };

  const getUser = (userId: string) => {
    return users.find((user) => user.userId === userId);
  };

  // Evento de conexão do Socket.IO
  io.on("connection", (socket) => {
    // Evento para adicionar usuário online
    socket.on("add-user", (userId, accessToken) => {
      addUser(userId, socket.id, accessToken);
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
          console.log(onlineUsers, "desconectado");
          break;
        }
      }

      removeUser(socket.id);
    });

    socket.on(
      "send-msg",
      async ({ userId, content, friendsId, receiverId }) => {
        const user = getUser(receiverId);
        const senderId = getUser(userId);
        const onlineReceiverVerfication = onlineUsers.get(receiverId);
      
        if(content.length === 0) {
          return
        }

        try {
          await api.post("/message", {
            content,
            friendsId,
            userId,
          });
        } catch (error) {
          console.log(error);
        }

        // send to message when the receiver user is online
        if (onlineReceiverVerfication) {
          io.to(user.socketId).emit("msg-recieve", {
            userId,
            friendsId,
            content,
          });
        }

        // send to message for the sender user
        if (senderId) {
          io.to(senderId.socketId).emit("msg-recieve", {
            userId,
            friendsId,
            content,
          });
        } else {
          return;
        }
      }
    );
  });
}

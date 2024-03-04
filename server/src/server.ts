import cors from "@fastify/cors";

import fastify from "fastify";

import { friendsRoute } from "./routes/friends";

import { messagesRoute } from "./routes/messages";
import { usersRoute } from "./routes/users";
import { WebSocket } from "./routes/websocket";

const app = fastify();

app.register(WebSocket)
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

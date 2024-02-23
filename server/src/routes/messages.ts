import { FastifyInstance } from "fastify";
import { io } from "socket.io-client";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function messagesRoute(app: FastifyInstance) {
  app.get("/messages", async () => {
    const message = await prisma.message.findMany();

    return {
      message,
    };
  });

  app.get("/message/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const message = await prisma.message.findFirstOrThrow({
      where: {
        id,
      },
    });

    return {
      message,
    };
  });

  app.get("/friendsmessages/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const friendsMessages = await prisma.message.findMany({
      where: {
        friendsId: id,
      },
    });

    return friendsMessages;
  });

  app.post("/message", async (request) => {
    const paramsSchema = z.object({
      content: z.string(),
      friendsId: z.string().uuid(),
      userId: z.string().uuid(),
    });

    const { content, friendsId, userId } = paramsSchema.parse(request.body);

    const receiverIdData = await prisma.friends.findUnique({
      where: {
        id: friendsId,
      },

      include: {
       user: {
        where: {
          id: {
            not: userId
          }
        }
       }
      },
    });

    const receiverId = receiverIdData?.user

    const message = prisma.message.create({
      data: {
        content,
        friendsId,
        userId,
      },
    });

    const createdAt = (await message).createdAt;

    const socket = io("ws://localhost:3333");
    (await message)
      ? socket.emit("send-msg", {
          content,
          friendsId,
          userId,
          createdAt,
          receiverId,
        })
      : null;

    return message;
  });
}

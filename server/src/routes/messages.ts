import { FastifyInstance } from "fastify";
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
    
    if(content.length === 0) {
      return
    }

    const message = prisma.message.create({
      data: {
        content,
        friendsId,
        userId,
      },
    });

    return message;
  });

  app.get('/receiverUserId/:currentUser/friend/:friendId', async (request) => {
    const paramsSchema = z.object({
      currentUser: z.string().uuid(),
      friendId: z.string().uuid(),
    });
  
    const { currentUser, friendId } = paramsSchema.parse(request.params);

    const receiverIdData = await prisma.friends.findUnique({
      where: {
        id: friendId,
      },

      include: {
       user: {
        where: {
          id: {
            not: currentUser
          }
        }
       }
      },
    });

    const receiverId = receiverIdData?.user

    return {receiverId}
  }) 
}

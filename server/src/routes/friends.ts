import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function friendsRoute(app: FastifyInstance) {
  app.get("/friends", async () => {
    const friends = await prisma.friends.findMany({
      include: {
        user: true,
      },
    });

    return {
      friends,
    };
  });

  app.get("/friendsMessages/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const friends = await prisma.friends.findUnique({
      where: {
        id,
      },

      include: {
        message: {
          select: {
            content: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    return { friends };
  });

  app.get("/getfriendsId/userOne/:userOne/userTwo/:userTwo", async (request) => {
     const paramsSchema = z.object({
      userOne: z.string(),
      userTwo: z.string(),
    });

    const { userOne, userTwo } = paramsSchema.parse(request.params);

    const getFriendsId = await prisma.friends.findMany({
      where: {
        user: {
          every: {
            id: { in: [userOne, userTwo] }
          }
        }
      }
    });

    return {
      getFriendsId,
    };
  });
  

  app.get("/friends/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const friends = await prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        friends: {
          include: {
            user: true,
          },
        },
      },
    });
    let teste;
    let resultado: any = [];
    const amigos = friends?.friends;

    amigos?.forEach(function (element: any) {
      teste = element.user.filter((user: any) => user.id !== id);
      resultado.push(teste);
    });

    return {
      friends: resultado,
    };
  });

  app.post("/friends", async (request) => {
    const bodySchema = z.object({
      userOne: z.string(),
      userTwo: z.string(),
    });

    const { userOne, userTwo } = bodySchema.parse(request.body);

    const friends = prisma.friends.create({
      data: {
        user: {
          connect: [{ id: userOne }, { id: userTwo }],
        },
      },
    });

    return friends;
  });
}

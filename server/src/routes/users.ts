import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function usersRoute(app: FastifyInstance) {
  app.get("/users", async () => {
    const users = await prisma.user.findMany();

    return {
      users,
    };
  });

  app.get("/user/:login", async (request) => {
    const paramsSchema = z.object({
      login: z.string(),
    });
    
    const { login } = paramsSchema.parse(request.params);

    const user = await prisma.user.findFirstOrThrow({
      where: {
        login,
      },
    });

    return { user };
  });

  app.get("/especificUser/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string(),
    });
    
    const { id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
    });

    return { user };
  });

  app.post("/register", async (request) => {
    const paramsSchema = z.object({
      avatarUrl: z.string(),
      login: z.string(),
      gitHubId: z.string(),
      name: z.string(),
    });

    const { avatarUrl, login, gitHubId, name } = paramsSchema.parse(
      request.body
    );

    try {
      let user = await prisma.user.findUnique({
        where: {
          gitHubId: gitHubId
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            avatarUrl,
            login,
            gitHubId,
            name,
          },
        });
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  });
}

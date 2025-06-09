import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { profileService } from "../services/profile.service.js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (c) => {
          await profileService.create(c.name || "Novo Usuário", c.id);
          console.log(c);
          // desse after, chama o serviço q cria o perfil do usuário
        },
      },
    },
  },
});

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../database/prisma/prisma-client";
import { container } from "tsyringe";
import { ProfileService } from "../services/profile.service";

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
          const profileService = container.resolve(ProfileService);
          await profileService.createProfile({
            bio: "",
            name: c.name,
            userId: c.id,
          });
        },
      },
    },
  },
});

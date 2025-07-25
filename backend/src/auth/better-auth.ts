import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../database/prisma/prisma-client";
import { z } from "zod";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3001"],
  // plugins: [bearer()],
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        fieldName: "bio",
        returned: true,
      },
      username: {
        required: true,
        type: "string",
        unique: true,
        returned: true,
        validator: {
          input: z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .max(20, "Username must be at most 20 characters long")
            .regex(
              /^[a-zA-Z0-9_]+$/,
              "Only letters, numbers, and underscores are allowed",
            ),
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});

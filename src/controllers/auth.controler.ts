import { Hono } from "hono";
import { auth } from "../auth/better-auth";
import { profileService } from "../services/profile.service";

export const authController = new Hono();

authController.post("/mock-user", async (c) => {
  const id = `mock-${Date.now()}`;
  const name = "Mock User";
  const email = `mock${Date.now()}@example.com`;

  const user = await prisma.user.create({
    data: {
      id,
      name,
      email,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await profileService.create(name, id);

  return c.json({ user }, 201);
});

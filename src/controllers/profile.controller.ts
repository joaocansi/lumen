import { Hono } from "hono";
import { z } from "zod";
import { profileService } from "../services/profile.service.js";

const profileController = new Hono();

profileController.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const profile = await profileService.getById(userId);
    return c.json(profile);
  } catch {
    return c.json({ message: "Perfil não encontrado" }, 404);
  }
});

profileController.post("/", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    userId: z.string(),
    name: z.string(),
    bio: z.string().nullable().optional(),
  });

  const data = schema.parse(body);

  const newProfile = await profileService.create(
    data.name,
    data.userId,
    data.bio
  );
  return c.json(newProfile, 201);
});

export default profileController;

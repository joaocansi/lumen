import { Hono } from "hono";
import type { Contex } from "hono";
import { z } from "zod";
import { profileService } from "../services/profile.service.js";
import { prisma } from "../database/prisma/prisma-client.js";
const profileController = new Hono();

// Rota GET /profile/:userId — busca perfil pelo userId
profileController.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const profile = await profileService.getById(userId);
    if (!profile) {
      return c.json({ message: "Perfil não encontrado" }, 404);
    }
    return c.json(profile);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Erro ao buscar perfil" }, 500);
  }
});

// Rota PATCH /profile — atualiza ou cria perfil (upsert)
profileController.patch("/", async (c: Context) => {
  try {
    const body = await c.req.json();
    const {
      userId,
      name,
      bio,
      //  image
    } = body;

    if (!userId) {
      return c.json({ error: "userId é obrigatório" }, 400);
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      update: {
        name,
        bio,
        // image,
      },
      create: {
        userId,
        name,
        bio,
        // image,
      },
    });

    return c.json({
      message: "Perfil atualizado com sucesso",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Erro ao atualizar o perfil" }, 500);
  }
});

// Rota POST /profile — cria perfil (se quiser manter)
profileController.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const schema = z.object({
      userId: z.string(),
      name: z.string(),
      bio: z.string().optional(),
      //  image: z.string().nullable().optional(), imagem ficou no user
    });

    const data = schema.parse(body);

    const newProfile = await profileService.create(
      data.name,
      data.userId,
      data.bio
      //data.image
    );

    return c.json(newProfile, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Erro ao criar perfil" }, 500);
  }
});

export default profileController;

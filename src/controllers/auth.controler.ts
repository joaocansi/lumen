import { Hono } from "hono";
import { auth } from "../auth/better-auth";
import { profileService } from "../services/profile.service";

export const authController = new Hono();

authController.post("/register", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await auth.client.signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      return c.json({ message: error.message || "Erro ao criar usuário" }, 400);
    }

    return c.json(
      { message: "Usuário criado com perfil", user: data.user },
      201
    );
  } catch (error: any) {
    console.error(error);
    return c.json({ message: error.message || "Erro interno" }, 500);
  }
});

//
authController.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await auth.client.signIn.email({
      email,
      password,
    });

    if (error) {
      return c.json({ message: error.message || "Credenciais inválidas" }, 401);
    }

    return c.json(
      { message: "Login bem-sucedido", user: data.user, token: data.token },
      200
    );
  } catch (error: any) {
    console.error(error);
    return c.json({ message: error.message || "Erro interno" }, 500);
  }
});

/* authController.post("/mock-user", async (c) => {
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
 */

import "reflect-metadata";
import "./container/container.js";
import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./auth/better-auth.js";
import { cors } from "hono/cors";

import profileController from "./controllers/profile.controller.js";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "/api/auth/*",
  cors({
    origin: "http://localhost:3001", // ou o domínio do seu frontend
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
);

// Middleware de sessão
app.use("*", async (c, next) => {
  const sessionWrapper = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", sessionWrapper?.user ?? null);
  c.set("session", sessionWrapper?.session ?? null); // só a session, não o objeto inteiro

  await next();
});

// Rota para teste
app.get("/session", (c) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user) return c.body(null, 401);

  return c.json({ user, session });
});

// Handler do auth
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/profile", profileController);

app.get("/", (c) => c.text("Bem-vindo!"));

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

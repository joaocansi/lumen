import "reflect-metadata";
import "./container/container.js";
import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./auth/better-auth.js";

import profileController from "./controllers/profile.controller.js";
import { authController } from "./controllers/auth.controler.js";

const app = new Hono();
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/profiles", profileController);

app.route("/auth", authController);

app.get("/", (c) => c.text("Bem-vindo!"));

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

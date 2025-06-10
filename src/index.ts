import "reflect-metadata";
import "dotenv/config";

import "./container";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "./auth/better-auth.js";
import { cors } from "hono/cors";

import { ProfileController } from "./controllers/profile.controller.js";
import { container } from "tsyringe";
import ServiceError from "./errors/ServiceError";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath("/");

app.use(
  "/auth/*",
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.onError((err, c) => {
  if (err instanceof ServiceError) return err.toApiError(c);
  return ServiceError.internalServerError(c);
});

const profileController = container.resolve(ProfileController);
app.route("/profile", profileController);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

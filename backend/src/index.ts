import "reflect-metadata";
import "dotenv/config";

import "./container";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "hono/serve-static";
import { auth } from "./auth/better-auth.js";
import { cors } from "hono/cors";

import { PhotoController } from "./controllers/photo.controller";
import { ProfileController } from "./controllers/profile.controller.js";
import { container } from "tsyringe";

import ServiceError from "./errors/ServiceError";
import fs from "fs";
import path from "path";
import { AuthController } from "./controllers/auth.controller";
import { prisma } from "./database/prisma/prisma-client";
import { connectOttoman } from "./couchbase";
import { LogModel } from "./couchbase/schemas/log";

await connectOttoman();

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

const __dirname = import.meta.dirname;
const uploadDir = path.resolve(__dirname, "../uploads");

app.use(
  "*",
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.onError(async (err, c) => {
    const timestamp = new Date().toISOString();
    const context = {
        stack: err.stack,
        url: c.req.url,
        method: c.req.method,
        userAgent: c.req.header("User-Agent"),
        ip: c.req.header("X-Forwarded-For") || c.req.header("X-Real-IP"),
    };

    LogModel.create({
        level: 'error',
        message: err.message,
        meta: {
            ...context,
            timestamp,
        },
    });

    if (err instanceof ServiceError) return err.toApiError(c);
    return ServiceError.internalServerError(c);
});

app.get(
  "/api/uploads/*",
  serveStatic({
    root: uploadDir,
    getContent: async (path) => {
      console.log(path);
      return await fs.promises.readFile(path);
    },
    rewriteRequestPath: (path) => path.replace(/^\/api\/uploads/, ""),
  }),
);

const profileController = container.resolve(ProfileController);
app.route("/api/profile", profileController);

const photoController = container.resolve(PhotoController);
app.route("/api/photo", photoController);

const authController = container.resolve(AuthController);
app.route("/api/auth", authController);

app.post('/reset', async (c) => {
  await prisma.photo.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.follow.deleteMany({})
  await prisma.like.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.verification.deleteMany({})
  await prisma.user.deleteMany({})
  return c.json({});
})

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
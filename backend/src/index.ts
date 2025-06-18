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

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

const __dirname = import.meta.dirname;
const uploadDir = path.resolve(__dirname, "../uploads");

app.use(
  "/api/auth/*",
  cors({
    origin: "http://localhost:3001",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.onError((err, c) => {
  if (err instanceof ServiceError) return err.toApiError(c);
  return ServiceError.internalServerError(c);
});

app.get('/api/uploads/*', serveStatic({
  root: uploadDir,
  getContent: async path => {
    console.log(path);
    return await fs.promises.readFile(path);
  },
  rewriteRequestPath: path =>
    path.replace(/^\/api\/uploads/, ''),
}));


const profileController = container.resolve(ProfileController);
app.route("/api/profile", profileController);

const photoController = container.resolve(PhotoController);
app.route("/api/photo", photoController);

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

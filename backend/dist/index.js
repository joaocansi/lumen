"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
require("./container");
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const better_auth_js_1 = require("./auth/better-auth.js");
const cors_1 = require("hono/cors");
const profile_controller_js_1 = require("./controllers/profile.controller.js");
const tsyringe_1 = require("tsyringe");
const ServiceError_1 = require("./errors/ServiceError");
const app = new hono_1.Hono();
app.use("/api/auth/*", (0, cors_1.cors)({
    origin: "http://localhost:3001",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
}));
app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return better_auth_js_1.auth.handler(c.req.raw);
});
app.onError((err, c) => {
    if (err instanceof ServiceError_1.default)
        return err.toApiError(c);
    return ServiceError_1.default.internalServerError(c);
});
const profileController = tsyringe_1.container.resolve(profile_controller_js_1.ProfileController);
app.route("/api/profile", profileController);
(0, node_server_1.serve)({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});

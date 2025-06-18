"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const better_auth_1 = require("../auth/better-auth");
async function isAuthenticated(c, next) {
    const sessionWrapper = await better_auth_1.auth.api.getSession({
        headers: c.req.raw.headers,
    });
    c.set("user", sessionWrapper?.user ?? null);
    c.set("session", sessionWrapper?.session ?? null);
    await next();
}

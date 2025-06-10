"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeAuthenticated = mustBeAuthenticated;
const better_auth_1 = require("../auth/better-auth");
async function mustBeAuthenticated(c, next) {
    const sessionWrapper = await better_auth_1.auth.api.getSession({
        headers: c.req.raw.headers,
    });
    if (!sessionWrapper || !sessionWrapper.session)
        c.status(401);
    c.set("user", sessionWrapper?.user ?? null);
    c.set("session", sessionWrapper?.session ?? null);
    await next();
}

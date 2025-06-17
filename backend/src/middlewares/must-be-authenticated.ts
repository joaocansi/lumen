import { Next } from "hono";
import { HonoContext } from "../@types/hono-context";
import { auth } from "../auth/better-auth";

export async function mustBeAuthenticated(c: HonoContext, next: Next) {
  const sessionWrapper = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!sessionWrapper || !sessionWrapper.session) c.status(401);

  c.set("user", sessionWrapper?.user ?? null);
  c.set("session", sessionWrapper?.session ?? null);

  await next();
}

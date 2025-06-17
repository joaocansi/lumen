import { auth } from "../auth/better-auth";
import { Context } from "hono";

export type HonoContext = Context<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>;

import { Hono } from "hono";
import { injectable } from "tsyringe";
import { isAuthenticated } from "../middlewares/is-authenticated";

@injectable()
export class AuthController extends Hono {
  constructor() {
    super();

    this.get("/me", isAuthenticated, async (c) => {
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Usuário não autenticado" }, 401);
      }

      return c.json({
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatarUrl: user.image,
          bio: user.bio,
        },
      });
    });
  }
}

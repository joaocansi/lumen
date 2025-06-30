import { Hono } from "hono";
import { ProfileService } from "../services/profile.service.js";
import { inject, injectable } from "tsyringe";
import { HonoContext } from "../@types/hono-context.js";
import { mustBeAuthenticated } from "../middlewares/must-be-authenticated.js";
import { isAuthenticated } from "../middlewares/is-authenticated.js";
import ServiceError from "../errors/ServiceError.js";

type UpdateProfileData = {
  name?: string;
  bio?: string;
};

@injectable()
export class ProfileController extends Hono {
  constructor(
    @inject("ProfileService")
    private profileService: ProfileService,
  ) {
    super();

    this.get(
      "/username/:username",
      isAuthenticated,
      this.getProfileByUsername.bind(this),
    );
    this.patch("/", mustBeAuthenticated, this.updateProfile.bind(this));
    this.post(
      "/follow/:username",
      mustBeAuthenticated,
      this.followProfile.bind(this),
    );
    this.delete(
      "/follow/:username",
      mustBeAuthenticated,
      this.unfollowProfile.bind(this),
    );

    this.get("/username/:username/followers", this.getFollowers.bind(this));
    this.get("/username/:username/followings", this.getFollowing.bind(this));
  }

  async getProfileByUsername(c: HonoContext) {
    const username = c.req.param("username");
    const user = c.get("user");

    const profile = await this.profileService.getProfileByUsername({
      username,
      sessionUserId: user?.id,
    });
    return c.json(profile);
  }

  async updateProfile(c: HonoContext) {
    const updateData: UpdateProfileData = await c.req.json();
    const user = c.get("user");

    if (!user) return ServiceError.internalServerError(c);

    const updatedProfile = await this.profileService.updateProfile({
      userId: user.id,
      ...updateData,
    });
    return c.json(updatedProfile);
  }

  async followProfile(c: HonoContext) {
    const username = c.req.param("username");
    const user = c.get("user");

    if (!user) return ServiceError.internalServerError(c);

    // Impede que usuário siga a si mesmo
    if (user.username === username) {
      return c.json({ error: "Você não pode seguir a si mesmo" }, 400);
    }

    await this.profileService.followProfile({
      followerId: user.id,
      followingUsername: username,
    });

    return c.json({ success: true });
  }

  async unfollowProfile(c: HonoContext) {
    const username = c.req.param("username");
    const user = c.get("user");

    if (!user) return ServiceError.internalServerError(c);

    await this.profileService.unfollowProfile({
      followerId: user.id,
      followingUsername: username,
    });

    return c.json({ success: true });
  }

  async getFollowers(c: HonoContext) {
    const username = c.req.param("username");
    const followers = await this.profileService.getFollowers(username);
    return c.json(followers);
  }

  async getFollowing(c: HonoContext) {
    const username = c.req.param("username");
    const following = await this.profileService.getFollowing(username);
    return c.json(following);
  }
}

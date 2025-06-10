import { Hono } from "hono";
import { ProfileService } from "../services/profile.service.js";
import { inject, injectable } from "tsyringe";
import { HonoContext } from "../@types/hono-context.js";
import { mustBeAuthenticated } from "../middlewares/must-be-authenticated.js";
import ServiceError from "../errors/ServiceError.js";

type UpdateProfileData = {
  name?: string;
  bio?: string;
};

@injectable()
export class ProfileController extends Hono {
  constructor(
    @inject("ProfileService")
    private profileService: ProfileService
  ) {
    super();

    this.get("/:profileId", this.getProfile.bind(this));
    this.patch("/", mustBeAuthenticated, this.updateProfile.bind(this));
  }

  async getProfile(c: HonoContext) {
    const profileId = c.req.param("profileId");
    const getProfileById = await this.profileService.getProfileById({ profileId });
    return c.json(getProfileById);
  }

  async updateProfile(c: HonoContext) {
    const updateData: UpdateProfileData = await c.req.json();
    const user = c.get("user");

    if (!user) return ServiceError.internalServerError(c);

    console.log(updateData);
    const updatedProfile = await this.profileService.updateProfile({
      userId: user.id,
      ...updateData,
    });
    return c.json(updatedProfile);
  }
}

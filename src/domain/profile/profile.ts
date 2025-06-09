import type { Profile } from "./profile.entity.js";

export interface IProfile {
  getUserProfile(userId: string): Promise<Profile | null>;

  createProfile(
    profile: Omit<Profile, "id" | "createdAt" | "updatedAt">
  ): Promise<Profile>;
}

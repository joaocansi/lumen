import type { Profile } from "./profile.entity.js";

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
  create(
    profile: Omit<Profile, "id" | "createdAt" | "updatedAt">
  ): Promise<Profile>;
  update(id: string, data: Partial<Profile>): Promise<Profile>;
}

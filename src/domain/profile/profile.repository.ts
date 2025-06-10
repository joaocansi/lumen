import type { ProfileEntity } from "./profile.entity.js";

export interface ProfileRepository {
  findById(id: string): Promise<ProfileEntity | null>;
  findByUserId(userId: string): Promise<ProfileEntity | null>;
  create(profile: Omit<ProfileEntity, "id" | "createdAt" | "updatedAt">): Promise<ProfileEntity>;
  update(id: string, data: Partial<ProfileEntity>): Promise<ProfileEntity>;
}

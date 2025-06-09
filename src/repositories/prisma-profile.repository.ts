import { prisma } from "../database/prisma/prisma-client.js";
import type { Profile } from "../domain/profile/profile.entity.js";
import type { ProfileRepository } from "../domain/profile/profile.repository.js";

export class ProfileRepositoryImpl implements ProfileRepository {
  async findById(id: string): Promise<Profile | null> {
    return prisma.profile.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({ where: { userId } });
  }

  async create(
    profile: Omit<Profile, "id" | "createdAt" | "updatedAt">
  ): Promise<Profile> {
    return prisma.profile.create({ data: profile });
  }

  async update(id: string, data: Partial<Profile>): Promise<Profile> {
    return prisma.profile.update({ where: { id }, data });
  }
}

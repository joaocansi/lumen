import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { ProfileEntity } from "../domain/profile/profile.entity.js";
import type { ProfileRepository } from "../domain/profile/profile.repository.js";

@injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
  async findById(id: string): Promise<ProfileEntity | null> {
    return prisma.profile.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<ProfileEntity | null> {
    return prisma.profile.findUnique({ where: { userId } });
  }

  async create(
    profile: Omit<ProfileEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ProfileEntity> {
    return prisma.profile.create({ data: profile });
  }

  async update(id: string, data: Partial<ProfileEntity>): Promise<ProfileEntity> {
    return prisma.profile.update({ where: { id }, data });
  }
}

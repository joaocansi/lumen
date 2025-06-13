import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { ProfileRepository } from "../domain/profile/profile.repository.js";
import { ProfileEntity } from "../domain/profile/profile.entity.js";

@injectable()
export class PrismaProfileRepository implements ProfileRepository {
  async findById(id: string): Promise<ProfileEntity | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<ProfileEntity | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async update(id: string, data: Partial<ProfileEntity>): Promise<ProfileEntity> {
    return prisma.user.update({ where: { id }, data });
  }
}

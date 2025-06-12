import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { PhotoEntity } from "../domain/photo/photo.entity.js";
import type { PhotoRepository } from "../domain/photo/photo.repository.js";

@injectable()
export class PrismaPhotoRepository implements PhotoRepository {
  async findById(id: string): Promise<PhotoEntity | null> {
    return prisma.photo.findUnique({ where: { id } });
  }

  async create(
    photo: Omit<PhotoEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<PhotoEntity> {
    return prisma.photo.create({ data: photo });
  }

  async update(id: string, data: Partial<PhotoEntity>): Promise<PhotoEntity> {
    return prisma.photo.update({ where: { id }, data });
  }
}

import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { PhotoEntity } from "../domain/photo/photo.entity.js";
import type { PaginatedPhotoEntity, PhotoRepository } from "../domain/photo/photo.repository.js";

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

  async get(limit: number, offset: number): Promise<PaginatedPhotoEntity> {
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.photo.count(),
    ]);

    return {
      photos,
      total,
      hasMore: offset + photos.length < total,
    };
  }

  async getByUserId(userId: string, limit: number, offset: number): Promise<PaginatedPhotoEntity> {
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        skip: offset,
        take: limit,
        where: {
          userId
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.photo.count({ where: { userId } }),
    ]);

    return {
      photos,
      total,
      hasMore: offset + photos.length < total,
    };
  }
}

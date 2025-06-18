import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { CreatePhotoData, PhotoRepository, UpdatePhotoData } from "../domain/photo/photo.repository.js";
import { Photo } from "../domain/photo/photo.js";
import { PrismaPhotoMapper } from "./prisma-photo.mapper.js";
import { Paginated } from "../@types/paginated.js";

@injectable()
export class PrismaPhotoRepository implements PhotoRepository {
  async findById(id: string): Promise<Photo | null> {
    const result = await prisma.photo.findUnique({ where: { id } });
    return result && PrismaPhotoMapper.toPhoto(result);
  }

  async create(data: CreatePhotoData): Promise<Photo> {
    const result = await prisma.photo.create({ data });
    return result && PrismaPhotoMapper.toPhoto(result);
  }

  async update(id: string, data: UpdatePhotoData): Promise<Photo> {
    const result = await prisma.photo.update({ where: { id }, data });
    return result && PrismaPhotoMapper.toPhoto(result);
  }

  async get(limit: number, offset: number): Promise<Paginated<Photo[]>> {
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          user: true,
        }
      }),
      prisma.photo.count(),
    ]);

    return {
      data: photos.map(PrismaPhotoMapper.toPhotoWithUser),
      total,
      hasMore: offset + photos.length < total,
    };
  }

  async getByUserId(userId: string, limit: number, offset: number): Promise<Paginated<Photo[]>> {
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        where: {
          userId
        },
      }),
      prisma.photo.count({ where: { userId } }),
    ]);

    return {
      data: photos.map(PrismaPhotoMapper.toPhoto),
      total,
      hasMore: offset + photos.length < total,
    };
  }
}

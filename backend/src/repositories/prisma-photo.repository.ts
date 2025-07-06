import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { CreatePhotoData, PhotoRepository, UpdatePhotoData } from "../domain/photo/photo.repository.js";
import { Photo, PhotoWithMetadata } from "../domain/photo/photo.js";
import { PrismaPhotoMapper } from "./prisma-photo.mapper.js";
import { Paginated } from "../@types/paginated.js";

@injectable()
export class PrismaPhotoRepository implements PhotoRepository {
  async findByIdWithMetadata(photoId: string, sessionUser?: string): Promise<PhotoWithMetadata | null> {
    const result = await Promise.all([
      prisma.photo.findUnique({
        where: { id: photoId },
        include: {
          user: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      sessionUser
        ? prisma.like.findUnique({
            where: { userId_photoId: {
              userId: sessionUser,
              photoId,
            } },
          }).then(like => !!like)
        : Promise.resolve(false),
    ])

    if (!result[0]) {
      return null;
    }

    return PrismaPhotoMapper.toPhotoWithMetadata({
      ...result[0],
      session: {
        isLiked: result[1],
      },
    });
  }

  async findById(id: string): Promise<Photo | null> {
    const result = await prisma.photo.findUnique({ 
      where: { id }, 
      include: {
        _count: {
          select: {
            comments: true,
            likes: true
          }
        } 
      } 
    });
    result
    return result && PrismaPhotoMapper.toPhoto(result);
  }

  async create(data: CreatePhotoData): Promise<Photo> {
    const result = await prisma.photo.create({ 
      data,
      include: {
        _count: {
          select: {
            comments: true,
            likes: true
          }
        } 
      }
    });
    return result && PrismaPhotoMapper.toPhoto(result);
  }

  async update(id: string, data: UpdatePhotoData): Promise<Photo> {
    const result = await prisma.photo.update({ 
      where: { id }, 
      data, 
      include: {
        _count: {
          select: {
            comments: true,
            likes: true
          }
        } 
      } 
    });
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
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
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

  async getByUserId(userId: string, limit: number, offset: number, sessionUser?: string): Promise<Paginated<Photo[]>> {
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        where: {
          userId
        },
        include: {
          _count: {
            select: {
              comments: true,
              likes: true
            }
          },
          likes: {
            where: {
              userId: sessionUser
            }
          }
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

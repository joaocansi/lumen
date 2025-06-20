import { injectable } from "tsyringe";
import { LikeRepository } from "../domain/like/like.repository";
import { prisma } from "../database/prisma/prisma-client";

@injectable()
export class PrismaLikeRepository implements LikeRepository {
  async likePhoto(photoId: string, userId: string): Promise<void> {
    await prisma.like.create({
      data: {
        photoId,
        userId,
      },
    });
  }

  async unlikePhoto(photoId: string, userId: string): Promise<void> {
    await prisma.like.delete({
      where: {
        userId_photoId: {
            photoId, 
            userId,
        },
      },
    });
  }

  async isLiked(photoId: string, userId: string): Promise<boolean> {
    const like = await prisma.like.findUnique({
      where: {
        userId_photoId: {
            photoId, 
            userId,
        }
      },
    });
    return !!like;
  }

  async getLikesByPhotoId(photoId: string): Promise<string[]> {
    const likes = await prisma.like.findMany({
      where: { photoId },
      select: { userId: true },
    });
    return likes.map(like => like.userId);
  }
}
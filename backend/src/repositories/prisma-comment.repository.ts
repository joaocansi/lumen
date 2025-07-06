import { prisma } from "../database/prisma/prisma-client";
import { CommentWithProfile } from "../domain/comment/comment";
import { CommentRepository, CreateComment } from "../domain/comment/comment.repository";
import { PrismaCommentMapper } from "./prisma-comment.mapper";

export class PrismaCommentRepository implements CommentRepository {
  async create(data: CreateComment): Promise<CommentWithProfile> {
    const newComment = await prisma.comment.create({
      data,
      include: {
        user: true
      }
    });

    return PrismaCommentMapper.toCommentWithMapper(newComment);
  }

  async findCommentsByPhotoId(photoId: string): Promise<CommentWithProfile[]> {
    const comments = await prisma.comment.findMany({
        where: {
            photoId,
        },
        include: {
            user: true
        }
    })
    return comments.map(PrismaCommentMapper.toCommentWithMapper)
  }
}
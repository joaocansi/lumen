import { Comment, User } from "@prisma/client";
import { CommentWithProfile } from "../domain/comment/comment";

export class PrismaCommentMapper {
    static toCommentWithMapper(comment: Comment & { user: User }): CommentWithProfile {
        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            profile: {
                name: comment.user.name,
                username: comment.user.username,
                avatarUrl: comment.user.image || undefined
            }
        }
    }
}
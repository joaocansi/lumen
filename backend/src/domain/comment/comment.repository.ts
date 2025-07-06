import { CommentWithProfile } from "./comment";

export type CreateComment = { photoId: string; userId: string; content: string; };

export interface CommentRepository {
    create(data: CreateComment): Promise<CommentWithProfile>;
    findCommentsByPhotoId(photoId: string): Promise<CommentWithProfile[]>;
}
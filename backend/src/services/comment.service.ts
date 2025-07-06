import { inject, injectable } from "tsyringe";
import { PhotoRepository } from "../domain/photo/photo.repository";
import { CommentRepository } from "../domain/comment/comment.repository";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";
import { CommentWithProfile } from "../domain/comment/comment";

type NewCommentInput = {
    user: {
    id: string
    },
    photoId: string,
    content: string,
}

@injectable()
export class CommentService {
    constructor(
        @inject('PhotoRepository')
        private photoRepository: PhotoRepository,
        @inject('CommentRepository')
        private commentRepository: CommentRepository,
    ) {}

    async newComment(data: NewCommentInput) {
        const photo = await this.photoRepository.findById(data.photoId);
        if (!photo)
            throw new ServiceError('Photo not found', ServiceErrorType.NotFound);

        const newComment = await this.commentRepository.create({
            photoId: data.photoId,
            userId: data.user.id,
            content: data.content
        });

        return newComment;
    }
}
import { Like, Photo as PhotoEntity, User } from "@prisma/client"
import { Photo, PhotoWithMetadata, PhotoWithUser } from "../domain/photo/photo"

type PhotoWithMetadataMapper = PhotoEntity & {
    user: User
    _count: {
        likes: number
        comments: number
    }
    session: {
        isLiked: boolean
    }
}

function toRelativePath(path: string) {
    return process.env.IMAGE_URL + '/' + path;
}

export class PrismaPhotoMapper {
    static toPhotoWithMetadata(photo: PhotoWithMetadataMapper): PhotoWithMetadata {
        return {
            id: photo.id,
            caption: photo.caption,
            uploadedAt: photo.createdAt,
            path: toRelativePath(photo.path),
            width: photo.width,
            height: photo.height,
            user: {
                name: photo.user.name,
                image: photo.user.image,
                username: photo.user.username,
            },
            likesCount: photo._count.likes,
            commentsCount: photo._count.comments,
            isLiked: photo.session.isLiked
        }
    }
    
    static toPhoto(photo: PhotoEntity & { _count: { likes: number, comments: number }, likes?: any[] }): Photo {
        return {
            id: photo.id,
            caption: photo.caption,
            uploadedAt: photo.createdAt,
            path: toRelativePath(photo.path),
            width: photo.width,
            height: photo.height,
            commentsCount: photo._count.comments,
            likesCount: photo._count.likes,
            isLiked: !!photo.likes && photo.likes.length > 0,
        }
    }
    
    static toPhotoWithUser(photo: PhotoEntity & { user: User, _count: { likes: number, comments: number }, likes?: any[] }): PhotoWithUser {
        return {
            id: photo.id,
            caption: photo.caption,
            uploadedAt: photo.createdAt,
            path: toRelativePath(photo.path),
            width: photo.width,
            height: photo.height,
            user: {
                name: photo.user.name,
                image: photo.user.image,
                username: photo.user.username,
            },
            commentsCount: photo._count.comments,
            likesCount: photo._count.likes,
            isLiked: !!photo.likes && photo.likes.length > 0,
        }
    }
}
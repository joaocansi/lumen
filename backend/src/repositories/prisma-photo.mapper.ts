import { Photo as PhotoEntity, User } from "@prisma/client"
import { Photo, PhotoWithMetadata, PhotoWithUser } from "../domain/photo/photo"

type PhotoWithMetadataMapper = PhotoEntity & {
    user: User
    _count: {
        likes: number
    }
    session: {
        isLiked: boolean
    }
}

export class PrismaPhotoMapper {
    static toPhotoWithMetadata(photo: PhotoWithMetadataMapper): PhotoWithMetadata {
        return {
            id: photo.id,
            caption: photo.caption,
            uploadedAt: photo.createdAt,
            url: photo.url,
            user: {
                name: photo.user.name,
                image: photo.user.image,
                username: photo.user.username,
            },
            likesCount: photo._count.likes,
            isLiked: photo.session.isLiked
        }
    }
    
    static toPhoto(photo: PhotoEntity): Photo {
        return {
            id: photo.id,
            caption: photo.caption,
            uploadedAt: photo.createdAt,
            url: photo.url
        }
    }
    
    static toPhotoWithUser(photo: PhotoEntity & { user: User }): PhotoWithUser {
        return {
            id: photo.id,
            caption: photo.caption,
            uploadedAt: photo.createdAt,
            url: photo.url,
            user: {
                name: photo.user.name,
                image: photo.user.image,
                username: photo.user.username,
            }
        }
    }
}
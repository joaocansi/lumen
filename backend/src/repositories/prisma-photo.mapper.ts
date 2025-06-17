import { Photo as PhotoEntity, User } from "@prisma/client"
import { Photo, PhotoWithUser } from "../domain/photo/photo"

export class PrismaPhotoMapper {
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
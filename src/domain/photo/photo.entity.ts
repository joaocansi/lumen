import { Photo } from "./photo";

export class PhotoEntity {
  id: string;
  profileId: string;
  caption: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;

  static toDomain(photo: PhotoEntity): Photo {
    return {
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      profileId: photo.profileId,
      uploadedAt: photo.createdAt,
    };
  }
}

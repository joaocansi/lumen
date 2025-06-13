/* eslint-disable no-undef */
import { inject, injectable } from "tsyringe";
import { PhotoRepository } from "../domain/photo/photo.repository";
import { FileUploaderProvider } from "../domain/file-uploader-provider";
import { Photo } from "../domain/photo/photo";
import { ProfileRepository } from "../domain/profile/profile.repository";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";
import { PhotoEntity } from "../domain/photo/photo.entity";

type NewPhotoInput = {
  image: File;
  caption: string;
  userId: string;
};

type NewPhotoOutput = Photo;

type GetPhotosByProfileInput = {
  limit: number;
  offset: number;
  username: string;
}

type GetPhotosByProfileOutput = {
  photos: Photo[];
  total: number;
  hasMore: boolean;
}

@injectable()
export class PhotoService {
  constructor(
    @inject("PhotoRepository")
    private photoRepository: PhotoRepository,
    @inject("ProfileRepository")
    private profileRepository: ProfileRepository,
    @inject("FileUploaderProvider")
    private fileUploader: FileUploaderProvider
  ) {}

  async newPhoto(data: NewPhotoInput): Promise<NewPhotoOutput> {
    const profile = await this.profileRepository.findById(data.userId);
    if (!profile) throw new ServiceError("perfil não existe", ServiceErrorType.NotFound);

    const uploadedFileHash = await this.fileUploader.upload(data.image);
    const photo = await this.photoRepository.create({
      caption: data.caption,
      userId: profile.id,
      url: uploadedFileHash,
    });

    return PhotoEntity.toDomain(photo);
  }

  async getPhotosByProfile(data: GetPhotosByProfileInput): Promise<GetPhotosByProfileOutput> {
    const profile = await this.profileRepository.findByUsername(data.username);
    if (!profile) throw new ServiceError("perfil não existe", ServiceErrorType.NotFound);      

    const photos = await this.photoRepository.getByUserId(profile.id, data.limit, data.offset);
    const photosDomain = photos['photos'].map(item => {
      return PhotoEntity.toDomain(item)
    });

    return {
      ...photos,
      photos: photosDomain
    };
  }
}

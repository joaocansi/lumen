/* eslint-disable no-undef */
import { inject, injectable } from "tsyringe";
import { PhotoRepository } from "../domain/photo/photo.repository";
import { FileUploaderProvider } from "../domain/file-uploader-provider";
import { Photo } from "../domain/photo/photo";
import { ProfileRepository } from "../domain/profile/profile.repository";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";
import { Paginated } from "../@types/paginated";
import { LikeRepository } from "../domain/like/like.repository";

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

type GetPhotosByProfileOutput = Paginated<Photo[]>

@injectable()
export class PhotoService {
  constructor(
    @inject("PhotoRepository")
    private photoRepository: PhotoRepository,
    @inject("LikeRepository")
    private likeRepository: LikeRepository,
    @inject("ProfileRepository")
    private profileRepository: ProfileRepository,
    @inject("FileUploaderProvider")
    private fileUploader: FileUploaderProvider
  ) {}

  async getPhotoById(photoId: string, sessionUserId?: string) {
    const photo = await this.photoRepository.findByIdWithMetadata(photoId, sessionUserId);
    if (!photo) throw new ServiceError("Foto não encontrada", ServiceErrorType.NotFound);
    return photo;
  }

  async newPhoto(data: NewPhotoInput): Promise<NewPhotoOutput> {
    const profile = await this.profileRepository.findById(data.userId);
    if (!profile) throw new ServiceError("perfil não existe", ServiceErrorType.NotFound);

    const uploadedFile = await this.fileUploader.upload(data.image);
    const photo = await this.photoRepository.create({
      caption: data.caption,
      userId: profile.id,
      ...uploadedFile,
    });

    return photo
  }

  async getPhotosByProfile(data: GetPhotosByProfileInput): Promise<GetPhotosByProfileOutput> {
    const profile = await this.profileRepository.findByUsername(data.username);
    if (!profile) throw new ServiceError("perfil não existe", ServiceErrorType.NotFound);      

    const photos = await this.photoRepository.getByUserId(profile.id, data.limit, data.offset);
    return photos;
  }

  async unlikePhoto(photoId: string, id: string) {
    const isLiked = await this.likeRepository.isLiked(photoId, id);
    if (!isLiked)
      throw new ServiceError("Foto não curtida", ServiceErrorType.NotFound);
    return this.likeRepository.unlikePhoto(photoId, id);
  }

  async likePhoto(photoId: string, id: string) {
    const isLiked = await this.likeRepository.isLiked(photoId, id);
    if (isLiked)
      throw new ServiceError("Foto já curtida", ServiceErrorType.AlreadyExists);
    return this.likeRepository.likePhoto(photoId, id)
  }
}

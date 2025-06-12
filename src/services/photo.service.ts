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
    const profile = await this.profileRepository.findByUserId(data.userId);
    if (!profile) throw new ServiceError("perfil não existe", ServiceErrorType.NotFound);

    const uploadedFileHash = await this.fileUploader.upload(data.image);
    const photo = await this.photoRepository.create({
      caption: data.caption,
      profileId: profile.id,
      url: uploadedFileHash,
    });

    return PhotoEntity.toDomain(photo);
  }
}

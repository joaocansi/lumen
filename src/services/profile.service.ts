import { inject, injectable } from "tsyringe";
import type { ProfileRepository } from "../domain/profile/profile.repository";
import { Profile } from "../domain/profile/profile";
import { ProfileEntity } from "../domain/profile/profile.entity";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";

type GetProfileByIdInput = {
  profileId: string;
};

type GetProfileByIdOutput = Profile;

type CreateProfileInput = {
  name: string;
  bio: string;
  userId: string;
};

type CreateProfileOutput = Profile;

type UpdateProfileInput = {
  userId: string;
  name?: string;
  bio?: string;
};

type UpdateProfileOutput = Profile;

@injectable()
export class ProfileService {
  constructor(
    @inject("ProfileRepository")
    private profileRepository: ProfileRepository
  ) {}

  async getProfileById(data: GetProfileByIdInput): Promise<GetProfileByIdOutput> {
    const profile = await this.profileRepository.findById(data.profileId);
    if (!profile) throw new ServiceError("Perfil não criado", ServiceErrorType.NotFound);
    return ProfileEntity.toDomain(profile);
  }

  async createProfile(data: CreateProfileInput): Promise<CreateProfileOutput> {
    const profile = await this.profileRepository.findByUserId(data.userId);
    if (profile) throw new ServiceError("Perfil já criado", ServiceErrorType.AlreadyExists);
    const createdProfile = await this.profileRepository.create(data);
    return ProfileEntity.toDomain(createdProfile);
  }

  async updateProfile(data: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const profile = await this.profileRepository.findByUserId(data.userId);
    if (!profile) throw new ServiceError("Perfil não criado", ServiceErrorType.NotFound);
    const { userId, ...updateData } = data;
    const updatedProfile = await this.profileRepository.update(profile.id, { ...updateData });
    return ProfileEntity.toDomain(updatedProfile);
  }
}

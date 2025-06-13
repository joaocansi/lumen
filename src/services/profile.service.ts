import { inject, injectable } from "tsyringe";
import type { ProfileRepository } from "../domain/profile/profile.repository";
import { Profile } from "../domain/profile/profile";
import { ProfileEntity } from "../domain/profile/profile.entity";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";

type GetProfileByIdInput = {
  profileId: string;
};

type GetProfileByIdOutput = Profile;

type UpdateProfileInput = {
  userId: string;
  name?: string;
  bio?: string;
};

type UpdateProfileOutput = Profile;

type FollowProfileInput = {
  followerId: string;
  followingUsername: string;
};

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

  async updateProfile(data: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const profile = await this.profileRepository.findById(data.userId)
    if (!profile) throw new ServiceError("Perfil não existe", ServiceErrorType.NotFound);
    const { userId, ...updateData } = data;
    const updatedProfile = await this.profileRepository.update(userId, { ...updateData });
    return ProfileEntity.toDomain(updatedProfile);
  }

  async followProfile(data: FollowProfileInput): Promise<void> {
    const { followerId, followingUsername } = data;

    const follower = await this.profileRepository.findById(followerId);
    if (!follower) {
      throw new ServiceError("Perfil (seguidor) não existe", ServiceErrorType.NotFound);
    }

    const following = await this.profileRepository.findByUsername(followingUsername);
    if (!following) {
      throw new ServiceError("Perfil (seguido) não encontrado", ServiceErrorType.NotFound);
    }

    if (follower.id === following.id) {
      throw new ServiceError("Você não pode seguir a si mesmo", ServiceErrorType.BadRequest);
    }

    // const alreadyFollowing = await this.profileRepository.isFollowing(follower.id, following.id);
    // if (alreadyFollowing) {
    //   throw new ServiceError("Você já está seguindo este usuário", ServiceErrorType.BadRequest);
    // }

    // await this.profileRepository.follow(follower.id, following.id);
  }
}

import { inject, injectable } from "tsyringe";
import type { ProfileRepository } from "../domain/profile/profile.repository";
import { Profile, ProfileWithFollowInfo } from "../domain/profile/profile";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";

type GetProfileByUsernameInput = {
  username: string;
  sessionUserId?: string;
};

type GetProfileUsernameOutput = ProfileWithFollowInfo & {
  _session: { 
    isFollowing: boolean, 
    isOwnProfile: boolean 
  }
};

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
    private profileRepository: ProfileRepository,
  ) {}

  async getProfileByUsername(data: GetProfileByUsernameInput): Promise<GetProfileUsernameOutput> {
    const profile = await this.profileRepository.findByUsername(data.username);
    if (!profile) {
      throw new ServiceError("Perfil não existe", ServiceErrorType.NotFound);
    }

    let isFollowing = false;
    let isOwnProfile = false;

    if (data.sessionUserId) {
      isFollowing = await this.profileRepository.isFollowing(data.sessionUserId, profile.id);
      isOwnProfile = data.sessionUserId === profile.id;
    }

    return Object.assign(profile, { _session: { isFollowing, isOwnProfile } })
  }

  async updateProfile(data: UpdateProfileInput): Promise<UpdateProfileOutput> {
    const profile = await this.profileRepository.findById(data.userId);
    if (!profile)
      throw new ServiceError("Perfil não existe", ServiceErrorType.NotFound);
    
    const { userId, ...updateData } = data;
    const updatedProfile = await this.profileRepository.update(userId, {
      ...updateData,
    });
    return updatedProfile;
  }

  async getFollowers(username: string): Promise<Profile[]> {
    const profile = await this.profileRepository.findByUsername(username);
    if (!profile) {
      throw new ServiceError(
        "Perfil não encontrado",
        ServiceErrorType.NotFound,
      );
    }

    const followers = await this.profileRepository.getFollowers(profile.id);
    return followers;
  }

  async getFollowing(username: string): Promise<Profile[]> {
    const profile = await this.profileRepository.findByUsername(username);
    if (!profile) {
      throw new ServiceError(
        "Perfil não encontrado",
        ServiceErrorType.NotFound,
      );
    }

    const following = await this.profileRepository.getFollowing(profile.id);
    return following;
  }

  async followProfile(data: FollowProfileInput): Promise<void> {
    const { followerId, followingUsername } = data;

    const follower = await this.profileRepository.findById(followerId);
    if (!follower) {
      throw new ServiceError(
        "Perfil (seguidor) não existe",
        ServiceErrorType.NotFound,
      );
    }

    const following =
      await this.profileRepository.findByUsername(followingUsername);
    if (!following) {
      throw new ServiceError(
        "Perfil (seguido) não encontrado",
        ServiceErrorType.NotFound,
      );
    }

    if (follower.id === following.id) {
      throw new ServiceError(
        "Você não pode seguir a si mesmo",
        ServiceErrorType.BadRequest,
      );
    }

    const alreadyFollowing = await this.profileRepository.isFollowing(
      follower.id,
      following.id,
    );
    if (alreadyFollowing) {
      throw new ServiceError(
        "Você já está seguindo este usuário",
        ServiceErrorType.BadRequest,
      );
    }

    await this.profileRepository.follow(follower.id, following.id);
  }

  async unfollowProfile(data: FollowProfileInput): Promise<void> {
    const { followerId, followingUsername } = data;

    const follower = await this.profileRepository.findById(followerId);
    if (!follower) {
      throw new ServiceError(
        "Perfil (seguidor) não existe",
        ServiceErrorType.NotFound,
      );
    }

    const following =
      await this.profileRepository.findByUsername(followingUsername);
    if (!following) {
      throw new ServiceError(
        "Perfil (seguido) não encontrado",
        ServiceErrorType.NotFound,
      );
    }

    if (follower.id === following.id) {
      throw new ServiceError(
        "Você não pode deixar de seguir a si mesmo",
        ServiceErrorType.BadRequest,
      );
    }

    const alreadyFollowing = await this.profileRepository.isFollowing(
      follower.id,
      following.id,
    );
    if (!alreadyFollowing) {
      throw new ServiceError(
        "Você não está seguindo este usuário",
        ServiceErrorType.BadRequest,
      );
    }

    await this.profileRepository.unfollow(follower.id, following.id);
  }
}

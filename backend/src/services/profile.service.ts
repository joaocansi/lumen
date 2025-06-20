import { inject, injectable } from "tsyringe";
import type { ProfileRepository } from "../domain/profile/profile.repository";
import { Profile } from "../domain/profile/profile";
import ServiceError, { ServiceErrorType } from "../errors/ServiceError";
import { prisma } from "../database/prisma/prisma-client";

type GetProfileByUsernameInput = {
  username: string;
};

type GetProfileUsernameOutput = Profile;

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

  async getProfileByUsername(
    data: GetProfileByUsernameInput & { currentUserId?: string },
  ): Promise<
    Profile & { followers: number; following: number; isFollowing: boolean }
  > {
    const profile = await this.profileRepository.findByUsername(data.username);
    if (!profile)
      throw new ServiceError("Perfil não criado", ServiceErrorType.NotFound);

    const [followers, following, isFollowing] = await Promise.all([
      prisma.follow.count({ where: { followingId: profile.id } }),
      prisma.follow.count({ where: { followerId: profile.id } }),
      data.currentUserId
        ? this.profileRepository.isFollowing(data.currentUserId, profile.id)
        : false,
    ]);

    return {
      ...profile,
      followers,
      following,
      isFollowing,
    };
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

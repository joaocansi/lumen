import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { ProfileRepository } from "../domain/profile/profile.repository.js";
import { Profile, ProfileWithFollowInfo } from "../domain/profile/profile.js";
import { PrismaProfileMapper } from "./prisma-profile.mapper.js";

@injectable()
export class PrismaProfileRepository implements ProfileRepository {
  async findById(id: string): Promise<Profile | null> {
    const result = await prisma.user.findUnique({ where: { id } });
    return result && PrismaProfileMapper.toProfile(result);
  }

  async findByUsername(username: string): Promise<ProfileWithFollowInfo | null> {
    const result = await prisma.user.findUnique({ 
      where: { username },
      include: {
        _count: {
          select: { followers: true, following: true, photos: true },
        },
      },
    });
    return result && PrismaProfileMapper.toProfileWithFollowInfo(result);
  }

  async update(
    id: string,
    data: Partial<Profile>,
  ): Promise<Profile> {
    const result = await prisma.user.update({ where: { id }, data });
    return result && PrismaProfileMapper.toProfile(result);
  }

  async follow(followerId: string, followingId: string): Promise<void> {
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!follow;
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async getFollowers(username: string): Promise<Profile[]> {
    const followers = await prisma.follow.findMany({
      where: { followingId: username },
      include: { follower: true },
    });

    return followers.map((f) => PrismaProfileMapper.toProfile(f.follower));
  }

  async getFollowing(username: string): Promise<Profile[]> {
    const following = await prisma.follow.findMany({
      where: { followerId: username },
      include: { following: true },
    });

    return following.map((f) => PrismaProfileMapper.toProfile(f.following));
  }
}

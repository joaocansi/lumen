import { injectable } from "tsyringe";
import { prisma } from "../database/prisma/prisma-client.js";
import type { ProfileRepository } from "../domain/profile/profile.repository.js";
import { ProfileEntity } from "../domain/profile/profile.entity.js";

@injectable()
export class PrismaProfileRepository implements ProfileRepository {
  async findById(id: string): Promise<ProfileEntity | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<ProfileEntity | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async update(
    id: string,
    data: Partial<ProfileEntity>,
  ): Promise<ProfileEntity> {
    return prisma.user.update({ where: { id }, data });
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

  async getFollowers(username: string): Promise<ProfileEntity[]> {
    const followers = await prisma.follow.findMany({
      where: { followingId: username },
      include: { follower: true },
    });

    return followers.map((f) => f.follower);
  }

  async getFollowing(username: string): Promise<ProfileEntity[]> {
    const following = await prisma.follow.findMany({
      where: { followerId: username },
      include: { following: true },
    });

    return following.map((f) => f.following);
  }
}

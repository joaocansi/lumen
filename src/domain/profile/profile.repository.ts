import { ProfileEntity } from "./profile.entity";

export interface ProfileRepository {
  findById(id: string): Promise<ProfileEntity | null>;
  findByUsername(username: string): Promise<ProfileEntity | null>;
  update(id: string, data: Partial<ProfileEntity>): Promise<ProfileEntity>;

  follow(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  unfollow(followerId: string, followingId: string): Promise<void>;

  getFollowers(username: string): Promise<ProfileEntity[]>;
  getFollowing(username: string): Promise<ProfileEntity[]>;
}

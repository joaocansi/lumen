import { Profile, ProfileWithFollowInfo } from "./profile";

type UpdateProfileData = Partial<Omit<Profile, 'id'>>;

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  findByUsername(username: string): Promise<ProfileWithFollowInfo | null>;

  update(id: string, data: UpdateProfileData): Promise<Profile>;

  follow(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  unfollow(followerId: string, followingId: string): Promise<void>;

  getFollowers(username: string): Promise<Profile[]>;
  getFollowing(username: string): Promise<Profile[]>;
}

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export type ProfileWithFollowInfo = Profile & {
  followersCount: number;
  followingCount: number;
  photosCount: number;
}
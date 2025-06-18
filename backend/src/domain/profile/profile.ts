export interface Profile {
  id: string;
  username: string;
  name: string;
  bio?: string;
}

export interface ProfileWithFollowInfo {
  username: string;
  name: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
}
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Comment {
  id: string;
  createdAt: Date;
  content: string;
  profile: {
    avatarUrl: string;
    name: string;
    username: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface Photo {
  id: string;
  path: string;
  width: number;
  height: number;
  caption: string;
  uploadedAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface PhotoWithProfile {
  id: string;
  path: string;
  width: number;
  height: number;
  caption: string;
  uploadedAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  user: {
    name: string;
    username: string;
    image?: string;
  };
}

export type ProfileWithMetadata = Profile & {
  followersCount: number;
  followingCount: number;
  photosCount: number;
};

export type ProfileWithMetadataAndSessionInfo = ProfileWithMetadata & {
  _session: {
    isFollowing: boolean;
    isOwnProfile: boolean;
  };
};

export interface SessionProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string | null;
  image?: string | null;
}

export interface ActionResponse<T> {
  response?: T;
  error?: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
}

import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Comment {
  id: number;
  username: string;
  text: string;
  timestamp: string;
  avatarUrl: string;
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
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
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
  error?: {
    details: any;
  };
}

export interface Paginated<T> {
  data: T[];
  total: number;
}

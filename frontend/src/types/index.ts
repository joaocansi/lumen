import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string | null;
  avatarUrl?: string | null;
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

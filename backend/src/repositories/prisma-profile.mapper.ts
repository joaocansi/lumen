import { User as UserEntity } from "@prisma/client"
import { FollowSuggestion, Profile, ProfileWithFollowInfo } from "../domain/profile/profile"

export type FollowSuggestionEntity = {
  id: string;
  username: string;
  name: string;
  image: string | null;
  followersCount: number;
  mutualFriendUsernames: string[];
  score: number;
};


export class PrismaProfileMapper {
    static toProfile(profile: UserEntity): Profile {
        return {
            id: profile.id,
            avatarUrl: profile.image,
            name: profile.name,
            username: profile.username,
            bio: profile.bio,
            email: profile.email,
        }
    }

    static toProfileWithFollowInfo(profile: UserEntity & { _count: { followers: number, following: number, photos: number } }): ProfileWithFollowInfo {
        return {
            id: profile.id,
            avatarUrl: profile.image,
            name: profile.name,
            username: profile.username,
            bio: profile.bio,
            email: profile.email,
            photosCount: profile._count.photos,
            followersCount: profile._count.followers,
            followingCount: profile._count.following,
        }
    }

    static toFollowSuggestion(followersSuggestion: FollowSuggestionEntity): FollowSuggestion {
        return {
            image: followersSuggestion.image,
            mutualFriendUsernames: followersSuggestion.mutualFriendUsernames,
            name: followersSuggestion.name,
            username: followersSuggestion.username
        }
    }
}
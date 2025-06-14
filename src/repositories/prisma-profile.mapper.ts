import { User as UserEntity } from "@prisma/client"
import { Profile, ProfileWithFollowInfo } from "../domain/profile/profile"

export class PrismaProfileMapper {
    static toProfile(profile: UserEntity): Profile {
        return {
            name: profile.name,
            username: profile.username,
            bio: profile.bio ?? undefined,
            id: profile.id
        }
    }

    static toProfileWithFollowInfo(profile: UserEntity & { followersCount: number, followingCount: number }): ProfileWithFollowInfo {
        return {
            name: profile.name,
            username: profile.username,
            bio: profile.bio ?? undefined,
            followersCount: profile.followersCount,
            followingCount: profile.followingCount
        }
    }
}
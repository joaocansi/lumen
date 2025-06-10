import { Profile } from "./profile";

export class ProfileEntity {
  id: string;
  name: string;
  bio: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  static toDomain(profile: ProfileEntity): Profile {
    return {
      id: profile.id,
      bio: profile.bio,
      name: profile.name,
      userId: profile.userId,
    };
  }
}

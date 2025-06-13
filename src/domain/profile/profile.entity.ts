import { Profile } from "./profile";

export class ProfileEntity {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;

  static toDomain(photo: ProfileEntity): Profile {
    return {
        bio: photo.bio ?? undefined,
        name: photo.name,
        username: photo.username
    };
  }
}

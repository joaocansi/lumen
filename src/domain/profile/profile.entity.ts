import { Profile } from "./profile";

export class ProfileEntity {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;

  static toDomain(entity: ProfileEntity): Profile {
    return {
      username: entity.username,
      name: entity.name,
      bio: entity.bio ?? undefined,
    };
  }
}

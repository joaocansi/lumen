import { ProfileEntity } from "./profile.entity";

export interface ProfileRepository {
  findById(id: string): Promise<ProfileEntity | null>;
  findByUsername(username: string): Promise<ProfileEntity | null>;
  update(id: string, data: Partial<ProfileEntity>): Promise<ProfileEntity>;
}

import { PhotoEntity } from "./photo.entity";

export interface PhotoRepository {
  findById(id: string): Promise<PhotoEntity | null>;
  create(photo: Omit<PhotoEntity, "id" | "createdAt" | "updatedAt">): Promise<PhotoEntity>;
  update(id: string, data: Partial<PhotoEntity>): Promise<PhotoEntity>;
}

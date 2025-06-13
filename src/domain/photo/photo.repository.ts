import { PhotoEntity } from "./photo.entity";

export type PaginatedPhotoEntity = {
  photos: PhotoEntity[];
  total: number;
  hasMore: boolean;
}

export interface PhotoRepository {
  findById(id: string): Promise<PhotoEntity | null>;
  create(photo: Omit<PhotoEntity, "id" | "createdAt" | "updatedAt">): Promise<PhotoEntity>;
  update(id: string, data: Partial<PhotoEntity>): Promise<PhotoEntity>;
  get(limit: number, offset: number): Promise<PaginatedPhotoEntity>;
  getByUserId(userId: string, limit: number, offset: number): Promise<PaginatedPhotoEntity>;
}

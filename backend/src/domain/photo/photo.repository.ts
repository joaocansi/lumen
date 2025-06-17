import { Paginated } from "../../@types/paginated";
import { Photo } from "./photo";

export type CreatePhotoData = Omit<Photo, "id" | "createdAt" | "updatedAt" | "uploadedAt"> & { userId: string };
export type UpdatePhotoData = Partial<Omit<Photo, 'userId'>>;

export interface PhotoRepository {
  findById(id: string): Promise<Photo | null>;
  create(photo: CreatePhotoData): Promise<Photo>;
  update(id: string, data: UpdatePhotoData): Promise<Photo>;
  get(limit: number, offset: number): Promise<Paginated<Photo[]>>;
  getByUserId(userId: string, limit: number, offset: number): Promise<Paginated<Photo[]>>;
}

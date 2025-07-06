import { Paginated } from "../../@types/paginated";
import { Photo, PhotoWithMetadata, RawPhoto } from "./photo";

export type CreatePhotoData = Omit<RawPhoto, "id" | "createdAt" | "updatedAt" | "uploadedAt"> & { userId: string };
export type UpdatePhotoData = Partial<Omit<Photo, 'userId'>>;

export interface PhotoRepository {
  findByIdWithMetadata(photoId: string, sessionUserId?: string): Promise<PhotoWithMetadata | null>;
  findById(id: string): Promise<Photo | null>;
  create(photo: CreatePhotoData): Promise<Photo>;
  update(id: string, data: UpdatePhotoData): Promise<Photo>;
  get(limit: number, offset: number): Promise<Paginated<Photo[]>>;
  getByUserId(userId: string, limit: number, offset: number, sessionUser?: string): Promise<Paginated<Photo[]>>;
}

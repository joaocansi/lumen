export interface LikeRepository {
  likePhoto(photoId: string, userId: string): Promise<void>;
  unlikePhoto(photoId: string, userId: string): Promise<void>;
  isLiked(photoId: string, userId: string): Promise<boolean>;
  getLikesByPhotoId(photoId: string): Promise<string[]>;
}
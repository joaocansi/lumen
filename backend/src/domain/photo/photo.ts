export class RawPhoto {
  id: string;
  caption: string;
  path: string;
  width: number;
  height: number;
  uploadedAt: Date;
}


export type Photo = RawPhoto & {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
} 

export type PhotoWithUser = Photo & {
  user: {
    name: string;
    username: string;
    image: string | null;
  }
}

export type PhotoWithMetadata = PhotoWithUser & {
  likesCount: number;
  isLiked: boolean; // Indicates if the session user has liked this photo
};
export class Photo {
  id: string;
  caption: string;
  url: string;
  uploadedAt: Date;
}

export type PhotoWithUser = Photo & {
  user: {
    name: string;
    username: string;
    image: string | null;
  }
}

export interface Profile {
  id: string;
  name: string;
  bio: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

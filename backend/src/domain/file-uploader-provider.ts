export interface Image {
  width: number;
  height: number;
  path: string;
}

export interface FileUploaderProvider {
  upload(file: File): Promise<Image>;
}

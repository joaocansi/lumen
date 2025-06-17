export interface FileUploaderProvider {
  upload(file: File): Promise<string>;
}

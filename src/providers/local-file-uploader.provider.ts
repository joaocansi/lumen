import { FileUploaderProvider } from "../domain/file-uploader-provider";
import { injectable } from "tsyringe";
import { randomUUID } from "crypto";

import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

@injectable()
export class LocalFileUploaderProvider implements FileUploaderProvider {
  private uploadDir = path.resolve(__dirname, "../../uploads");

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.promises.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  }
}

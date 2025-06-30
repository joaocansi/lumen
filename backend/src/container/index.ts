import { container } from "tsyringe";
import { ProfileRepository } from "../domain/profile/profile.repository";
import { PrismaProfileRepository } from "../repositories/prisma-profile.repository";
import { ProfileService } from "../services/profile.service";
import { ProfileController } from "../controllers/profile.controller";
import { FileUploaderProvider } from "../domain/file-uploader-provider";
import { LocalFileUploaderProvider } from "../providers/local-file-uploader.provider";
import { PhotoService } from "../services/photo.service";
import { PhotoController } from "../controllers/photo.controller";
import { PhotoRepository } from "../domain/photo/photo.repository";
import { PrismaPhotoRepository } from "../repositories/prisma-photo.repository";

import { LikeRepository } from "../domain/like/like.repository";
import { PrismaLikeRepository } from "../repositories/prisma-like.repository";
import { AuthController } from "../controllers/auth.controller";

container.registerSingleton<FileUploaderProvider>(
  "FileUploaderProvider",
  LocalFileUploaderProvider,
);

container.registerSingleton<ProfileRepository>(
  "ProfileRepository",
  PrismaProfileRepository,
);
container.registerSingleton<ProfileService>("ProfileService", ProfileService);
container.registerSingleton<ProfileController>(
  "ProfileController",
  ProfileController,
);
container.registerSingleton<AuthController>("AuthController", AuthController);

container.registerSingleton<LikeRepository>(
  "LikeRepository",
  PrismaLikeRepository,
);

container.registerSingleton<PhotoRepository>(
  "PhotoRepository",
  PrismaPhotoRepository,
);
container.registerSingleton<PhotoService>("PhotoService", PhotoService);
container.registerSingleton<PhotoController>(
  "PhotoController",
  PhotoController,
);

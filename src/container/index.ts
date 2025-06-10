import { container } from "tsyringe";
import { ProfileRepository } from "../domain/profile/profile.repository";
import { ProfileRepositoryImpl } from "../repositories/prisma-profile.repository";
import { ProfileService } from "../services/profile.service";
import { ProfileController } from "../controllers/profile.controller";

container.registerSingleton<ProfileRepository>("ProfileRepository", ProfileRepositoryImpl);
container.registerSingleton<ProfileService>("ProfileService", ProfileService);
container.registerSingleton<ProfileController>("ProfileController", ProfileController);

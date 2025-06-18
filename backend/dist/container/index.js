"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const prisma_profile_repository_1 = require("../repositories/prisma-profile.repository");
const profile_service_1 = require("../services/profile.service");
const profile_controller_1 = require("../controllers/profile.controller");
tsyringe_1.container.registerSingleton("ProfileRepository", prisma_profile_repository_1.ProfileRepositoryImpl);
tsyringe_1.container.registerSingleton("ProfileService", profile_service_1.ProfileService);
tsyringe_1.container.registerSingleton("ProfileController", profile_controller_1.ProfileController);

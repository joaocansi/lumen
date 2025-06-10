"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_client_1 = require("../database/prisma/prisma-client");
const tsyringe_1 = require("tsyringe");
const profile_service_1 = require("../services/profile.service");
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma_client_1.prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    databaseHooks: {
        user: {
            create: {
                after: async (c) => {
                    const profileService = tsyringe_1.container.resolve(profile_service_1.ProfileService);
                    await profileService.createProfile({
                        bio: "",
                        name: c.name,
                        userId: c.id,
                    });
                },
            },
        },
    },
});

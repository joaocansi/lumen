import type { ProfileRepository } from "../domain/profile/profile.repository.js";
import { ProfileRepositoryImpl } from "../repositories/prisma-profile.repository.js";

const profileRepository: ProfileRepository = new ProfileRepositoryImpl();

export const profileService = {
  getById: async (userId: string) => {
    const profile = await profileRepository.findByUserId(userId); // ✅ corrigido
    if (!profile) throw new Error("Profile não encontrado");
    return profile;
  },

  create: (name: string, userId: string, bio?: string) =>
    profileRepository.create({ name, userId, bio }),
};

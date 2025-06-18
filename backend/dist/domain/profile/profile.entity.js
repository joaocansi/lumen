"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileEntity = void 0;
class ProfileEntity {
    id;
    name;
    bio;
    userId;
    createdAt;
    updatedAt;
    static toDomain(profile) {
        return {
            id: profile.id,
            bio: profile.bio,
            name: profile.name,
            userId: profile.userId,
        };
    }
}
exports.ProfileEntity = ProfileEntity;

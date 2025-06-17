"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const tsyringe_1 = require("tsyringe");
const profile_entity_1 = require("../domain/profile/profile.entity");
const ServiceError_1 = require("../errors/ServiceError");
let ProfileService = class ProfileService {
    profileRepository;
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }
    async getProfileById(data) {
        const profile = await this.profileRepository.findById(data.profileId);
        if (!profile)
            throw new ServiceError_1.default("Perfil não criado", ServiceError_1.ServiceErrorType.NotFound);
        return profile_entity_1.ProfileEntity.toDomain(profile);
    }
    async createProfile(data) {
        const profile = await this.profileRepository.findByUserId(data.userId);
        if (profile)
            throw new ServiceError_1.default("Perfil já criado", ServiceError_1.ServiceErrorType.AlreadyExists);
        const createdProfile = await this.profileRepository.create(data);
        return profile_entity_1.ProfileEntity.toDomain(createdProfile);
    }
    async updateProfile(data) {
        const profile = await this.profileRepository.findByUserId(data.userId);
        if (!profile)
            throw new ServiceError_1.default("Perfil não criado", ServiceError_1.ServiceErrorType.NotFound);
        const { userId, ...updateData } = data;
        const updatedProfile = await this.profileRepository.update(profile.id, { ...updateData });
        return profile_entity_1.ProfileEntity.toDomain(updatedProfile);
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ProfileRepository")),
    __metadata("design:paramtypes", [Object])
], ProfileService);

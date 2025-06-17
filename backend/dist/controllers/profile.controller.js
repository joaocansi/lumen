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
exports.ProfileController = void 0;
const hono_1 = require("hono");
const profile_service_js_1 = require("../services/profile.service.js");
const tsyringe_1 = require("tsyringe");
const must_be_authenticated_js_1 = require("../middlewares/must-be-authenticated.js");
const ServiceError_js_1 = require("../errors/ServiceError.js");
let ProfileController = class ProfileController extends hono_1.Hono {
    profileService;
    constructor(profileService) {
        super();
        this.profileService = profileService;
        this.get("/:profileId", this.getProfile.bind(this));
        this.patch("/", must_be_authenticated_js_1.mustBeAuthenticated, this.updateProfile.bind(this));
    }
    async getProfile(c) {
        const profileId = c.req.param("profileId");
        const getProfileById = await this.profileService.getProfileById({ profileId });
        return c.json(getProfileById);
    }
    async updateProfile(c) {
        const updateData = await c.req.json();
        const user = c.get("user");
        if (!user)
            return ServiceError_js_1.default.internalServerError(c);
        console.log(updateData);
        const updatedProfile = await this.profileService.updateProfile({
            userId: user.id,
            ...updateData,
        });
        return c.json(updatedProfile);
    }
};
exports.ProfileController = ProfileController;
exports.ProfileController = ProfileController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ProfileService")),
    __metadata("design:paramtypes", [profile_service_js_1.ProfileService])
], ProfileController);

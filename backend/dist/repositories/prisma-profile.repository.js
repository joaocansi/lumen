"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRepositoryImpl = void 0;
const tsyringe_1 = require("tsyringe");
const prisma_client_js_1 = require("../database/prisma/prisma-client.js");
let ProfileRepositoryImpl = class ProfileRepositoryImpl {
    async findById(id) {
        return prisma_client_js_1.prisma.profile.findUnique({ where: { id } });
    }
    async findByUserId(userId) {
        return prisma_client_js_1.prisma.profile.findUnique({ where: { userId } });
    }
    async create(profile) {
        return prisma_client_js_1.prisma.profile.create({ data: profile });
    }
    async update(id, data) {
        return prisma_client_js_1.prisma.profile.update({ where: { id }, data });
    }
};
exports.ProfileRepositoryImpl = ProfileRepositoryImpl;
exports.ProfileRepositoryImpl = ProfileRepositoryImpl = __decorate([
    (0, tsyringe_1.injectable)()
], ProfileRepositoryImpl);

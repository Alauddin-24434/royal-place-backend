"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.envVariable.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.envVariable.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
exports.createRefreshToken = createRefreshToken;

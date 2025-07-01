"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = exports.handleRefreshToken = void 0;
const config_1 = require("../../config");
const appError_1 = require("../../error/appError");
const logger_1 = require("../../utils/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = __importDefault(require("./user.schema"));
const mongo_sanitize_1 = __importDefault(require("mongo-sanitize"));
//======================================================== Registration ===================================================================
const registerUserIntoDb = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanBody = (0, mongo_sanitize_1.default)(body);
    // Check if user already exists by email
    const isUserExist = yield user_schema_1.default.findOne({ email: cleanBody.email });
    if (isUserExist) {
        logger_1.logger.warn("⚠️ Registration failed: User already exists");
        throw new appError_1.AppError("User already exists!", 400);
    }
    // Create new user - password hashing automatically handled by pre('save') middleware
    const newUser = yield user_schema_1.default.create(cleanBody);
    logger_1.logger.info(`✅ New user registered: ${newUser.email}`);
    return newUser;
});
// ============================================ Login user ==============================================
const loginUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanEmail = (0, mongo_sanitize_1.default)(email);
    const isUserExist = yield user_schema_1.default.findOne({ email: cleanEmail });
    if (!isUserExist) {
        throw new appError_1.AppError("User does not exist!", 404);
    }
    return isUserExist;
});
//================================ Find single user =============================================
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanId = (0, mongo_sanitize_1.default)(id);
    const user = yield user_schema_1.default.findById(cleanId);
    if (!user) {
        throw new appError_1.AppError("User not found!", 404);
    }
    return user;
});
// ===================================================== Find all users ==========================================
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_schema_1.default.find().sort({ createdAt: -1 }); // latest first
    return users;
});
// ===================================================== Delete user ===============================================
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanId = (0, mongo_sanitize_1.default)(id);
    // Find the user by ID
    const user = yield user_schema_1.default.findById(cleanId);
    if (!user) {
        throw new appError_1.AppError("Failed to delete user. User not found!", 404);
    }
    // Soft delete: set isDeleted = true
    user.isDeleted = true;
    yield user.save();
    return user;
});
//=========================================== Update user ===========================================================
const updateUserById = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanId = (0, mongo_sanitize_1.default)(id);
    const cleanUpdateData = (0, mongo_sanitize_1.default)(updateData);
    // Only update if the user exists and is not soft deleted
    const updatedUser = yield user_schema_1.default.findOneAndUpdate({ _id: cleanId, isDeleted: false }, cleanUpdateData, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        throw new appError_1.AppError("User not found or has been deleted!", 404);
    }
    return updatedUser;
});
// ====================================================== Refresh token ==============================================
const handleRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanRefreshToken = (0, mongo_sanitize_1.default)(refreshToken);
    const decoded = jsonwebtoken_1.default.verify(cleanRefreshToken, config_1.envVariable.JWT_REFRESH_TOKEN_SECRET);
    const user = yield user_schema_1.default.findById(decoded.id);
    if (!user) {
        throw new appError_1.AppError("User not found", 404);
    }
    return user;
});
exports.handleRefreshToken = handleRefreshToken;
// ============================== Export Services ==========================================================
exports.userServices = {
    registerUserIntoDb,
    loginUserByEmail,
    findUserById,
    getAllUsers,
    deleteUserById,
    updateUserById,
    handleRefreshToken: exports.handleRefreshToken,
};

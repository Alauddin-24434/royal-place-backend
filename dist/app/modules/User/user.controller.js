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
exports.userController = exports.refreshAccessToken = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongo_sanitize_1 = __importDefault(require("mongo-sanitize"));
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const user_sevices_1 = require("./user.sevices");
const generateTokens_1 = require("../../utils/generateTokens");
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
const appError_1 = require("../../error/appError");
// ================= Registration =====================
const regestrationUser = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = (0, mongo_sanitize_1.default)(req.body);
    const user = yield user_sevices_1.userServices.registerUserIntoDb(body);
    const payload = { id: user._id, role: user.role };
    const accessToken = (0, generateTokens_1.createAccessToken)(payload);
    const refreshToken = (0, generateTokens_1.createRefreshToken)(payload);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.envVariable.ENV === "production",
        sameSite: config_1.envVariable.ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
            accessToken,
            user,
        },
    });
}));
// ================= Login ======================
const loginUser = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = (0, mongo_sanitize_1.default)(req.body.email);
    const password = (0, mongo_sanitize_1.default)(req.body.password);
    const user = yield user_sevices_1.userServices.loginUserByEmail(email);
    if (!user) {
        logger_1.logger.warn("⚠️ Login failed: User not found");
        throw new appError_1.AppError("Invalid email or password", 401);
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        logger_1.logger.warn("⚠️ Login failed: Incorrect password");
        throw new appError_1.AppError("Invalid email or password", 401);
    }
    const payload = { id: user._id, role: user.role };
    const accessToken = (0, generateTokens_1.createAccessToken)(payload);
    const refreshToken = (0, generateTokens_1.createRefreshToken)(payload);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.envVariable.ENV === "production",
        sameSite: config_1.envVariable.ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            accessToken,
            user,
        },
    });
}));
//================================find single user=============================================
const getSingleUser = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, mongo_sanitize_1.default)(req.params.id);
    const user = yield user_sevices_1.userServices.findUserById(id);
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
}));
// ===================================================== find all user==========================================
const getAllUsers = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_sevices_1.userServices.getAllUsers();
    logger_1.logger.info("All users fetched successfully");
    res.status(200).json({
        success: true,
        message: "All users fetched successfully",
        data: users,
    });
}));
// =====================================================delete user=================================================
const deleteUser = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, mongo_sanitize_1.default)(req.params.id);
    const deletedUser = yield user_sevices_1.userServices.deleteUserById(id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
    });
}));
//=========================================== update user================================================================
const updateUser = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (0, mongo_sanitize_1.default)(req.params.id);
    let updatedData;
    const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (imageUrl) {
        updatedData = (0, mongo_sanitize_1.default)(Object.assign(Object.assign({}, req.body), { image: imageUrl }));
    }
    else {
        updatedData = (0, mongo_sanitize_1.default)(req.body);
    }
    const user = yield user_sevices_1.userServices.updateUserById(id, updatedData);
    const payload = { id: user._id, role: user.role };
    const refreshToken = (0, generateTokens_1.createRefreshToken)(payload);
    const accessToken = (0, generateTokens_1.createAccessToken)(payload);
    // ⏬ Send refresh token via cookie or header
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config_1.envVariable.ENV === "production",
        sameSite: config_1.envVariable.ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    res.status(200)
        .json({
        success: true,
        message: "User updated successfully",
        data: {
            accessToken,
            user,
        },
    });
}));
// ======================================================refresh token ==============================================
exports.refreshAccessToken = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshTokenRaw = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || req.headers["x-refresh-token"];
    const refreshToken = (0, mongo_sanitize_1.default)(refreshTokenRaw);
    if (!refreshToken) {
        throw new appError_1.AppError("Refresh token missing", 401);
    }
    const user = yield user_sevices_1.userServices.handleRefreshToken(refreshToken);
    const payload = { id: user._id, role: user.role };
    // accessToken
    const accessToken = (0, generateTokens_1.createAccessToken)(payload);
    res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
    });
}));
// ======================export controller===============================================
exports.userController = {
    regestrationUser,
    loginUser,
    getSingleUser,
    getAllUsers,
    deleteUser,
    updateUser,
    refreshAccessToken: exports.refreshAccessToken
};

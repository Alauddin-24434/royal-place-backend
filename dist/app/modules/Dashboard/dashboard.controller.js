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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const catchAsyncHandeller_1 = require("../../utils/catchAsyncHandeller");
const appError_1 = require("../../error/appError");
const dashboard_service_1 = require("./dashboard.service");
const getDashboardData = (0, catchAsyncHandeller_1.catchAsyncHandeller)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role; // Role comes from authenticated user
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id; // Also from auth middleware
    if (!role) {
        throw new appError_1.AppError("User role is required", 400);
    }
    const data = yield dashboard_service_1.dashboardService.dashboardOverviewByRole(role, userId);
    res.status(200).json(Object.assign({ success: true }, data));
}));
exports.dashboardController = {
    getDashboardData,
};

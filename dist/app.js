"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandeller_1 = __importDefault(require("./app/middleware/globalErrorHandeller"));
const api_1 = require("./app/api");
// ==============================
// App Configuration
// ==============================
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:3000", "https://royal-place.vercel.app"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
//==================================== Root and Utility Routes========================================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Database connected",
    });
});
// =======================Main Api Routes===============================
(0, api_1.initialRoute)(app);
// ==============================404 Not Found Handler=======================================
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Page Not Found",
    });
});
// ==============================
// Global Error Handler
// ==============================
app.use(globalErrorHandeller_1.default);
// ==============================
// Export App
// ==============================
exports.default = app;

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
exports.mlService = void 0;
const axios_1 = __importDefault(require("axios"));
const PYTHON_API = "http://localhost:8000";
exports.mlService = {
    predictPrice: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${PYTHON_API}/predict-price`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }),
    predictCancelRisk: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${PYTHON_API}/predict-cancel-risk`, data);
        return response.data;
    }),
    bookRoom: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${PYTHON_API}/book-room`, data);
        return response.data;
    }),
    chatBot: (message) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${PYTHON_API}/chatbot`, { message });
        return response.data;
    }),
};

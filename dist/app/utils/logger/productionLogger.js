"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionLogger = void 0;
const winston_1 = require("winston");
exports.productionLogger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "HH:mm:ss"
    }), winston_1.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level} ${message}`;
    })),
    transports: [new winston_1.transports.Console()],
});

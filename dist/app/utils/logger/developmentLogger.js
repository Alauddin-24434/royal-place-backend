"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developmentLogger = void 0;
const winston_1 = require("winston");
exports.developmentLogger = (0, winston_1.createLogger)({
    level: "debug",
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({
        format: "HH:mm:ss"
    }), winston_1.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level} ${message}`;
    })),
    transports: [new winston_1.transports.Console()]
});

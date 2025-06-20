"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config_1 = require("../../config");
const developmentLogger_1 = require("./developmentLogger");
const productionLogger_1 = require("./productionLogger");
exports.logger = config_1.envVariable.ENV === "production" ? productionLogger_1.productionLogger : developmentLogger_1.developmentLogger;

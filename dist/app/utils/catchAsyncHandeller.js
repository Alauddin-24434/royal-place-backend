"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsyncHandeller = void 0;
const catchAsyncHandeller = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsyncHandeller = catchAsyncHandeller;

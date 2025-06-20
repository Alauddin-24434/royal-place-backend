"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomStatus = exports.RoomType = void 0;
var RoomType;
(function (RoomType) {
    RoomType["Luxury"] = "luxury";
    RoomType["Suite"] = "suite";
    RoomType["Deluxe"] = "deluxe";
    RoomType["Twin"] = "twin";
})(RoomType || (exports.RoomType = RoomType = {}));
var RoomStatus;
(function (RoomStatus) {
    RoomStatus["Active"] = "active";
    RoomStatus["Maintenance"] = "maintenance";
    RoomStatus["Inactive"] = "inactive";
})(RoomStatus || (exports.RoomStatus = RoomStatus = {}));
var BedType;
(function (BedType) {
    BedType["King"] = "king";
    BedType["Queen"] = "queen";
    BedType["Twin"] = "twin";
    BedType["Double"] = "double";
    BedType["Single"] = "single";
})(BedType || (BedType = {}));

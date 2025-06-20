"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryFilters = void 0;
const buildQueryFilters = (query, filterMap) => {
    const filters = {};
    for (const key in filterMap) {
        const value = query[key];
        // Skip undefined or empty string values
        if (value !== undefined && value !== "") {
            filters[filterMap[key]] = value;
        }
    }
    return filters;
};
exports.buildQueryFilters = buildQueryFilters;

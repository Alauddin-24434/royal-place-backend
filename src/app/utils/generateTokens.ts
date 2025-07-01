import jwt from "jsonwebtoken";
import { envVariable } from "../config";

export const createAccessToken = (payload: object) => {
 return jwt.sign(payload, envVariable.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
};

export const createRefreshToken = (payload: object) => {
 return jwt.sign(payload, envVariable.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

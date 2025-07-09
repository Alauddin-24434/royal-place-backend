import jwt from "jsonwebtoken";
import { envVariable } from "../../config";

export const createAccessToken = (payload: object) => {
 return jwt.sign(payload, envVariable.JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
};

export const createRefreshToken = (payload: object) => {
 return jwt.sign(payload, envVariable.JWT_REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
};

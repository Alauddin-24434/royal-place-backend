import { envVariable } from '.';
import { CookieOptions } from 'express';

const isProduction = envVariable.NODE_ENV !== 'development'; // ✅ "not development" → production

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false, // 🔒 only true in production
  sameSite:"lax",
  path: '/',
};

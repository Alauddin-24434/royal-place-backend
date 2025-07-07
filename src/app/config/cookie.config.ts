// src/config/cookie.config.ts
import { envVariable } from '.';
import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: envVariable.ENV === 'production' ? true : false,
    sameSite: envVariable.ENV === 'production' ? 'none' : 'lax',
    path: '/',
};

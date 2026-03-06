import { cookies } from "next/headers";
import { logger } from "../utils/logger";
import { ACCESS_EXPIRY, REFRESH_EXPIRY_DAYS } from "./jwt";

const IS_PROD = process.env.NODE_ENV === "production";

// Use constants for cookie keys and durations
export const COOKIES = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
} as const;

// Dynamic expiry based on environment variables
const ACCESS_TOKEN_MAX_AGE = parseDurationToSeconds(ACCESS_EXPIRY);
const REFRESH_TOKEN_MAX_AGE = REFRESH_EXPIRY_DAYS * 24 * 60 * 60; // Convert days to seconds

/**
 * Sets the access token cookie.
 */
export async function setAccessTokenCookie(token: string, userId?: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIES.ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "lax",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        path: "/",
    });
    if (userId) logger.info("Token refreshed", { userId });
}

/**
 * Sets the refresh token cookie.
 */
export async function setRefreshTokenCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIES.REFRESH_TOKEN, token, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "lax",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        path: "/",
    });
}

/**
 * Sets both access and refresh token cookies.
 */
export async function setAuthCookies(
    accessToken: string,
    refreshToken: string,
    userId?: string,
    action: string = "User logged in"
) {
    await setAccessTokenCookie(accessToken);
    await setRefreshTokenCookie(refreshToken);
    if (userId) logger.info(action, { userId });
}

/**
 * Clears authentication cookies.
 */
export async function clearAuthCookies(userId?: string) {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIES.ACCESS_TOKEN);
    cookieStore.delete(COOKIES.REFRESH_TOKEN);
    if (userId) logger.info("User logged out", { userId });
}

/**
 * Parses a duration string (e.g., "15m", "1h", "7d") into seconds.
 */
function parseDurationToSeconds(duration: string | number): number {
    if (typeof duration === "number") return duration;
    if (!duration) return 0;
    const trimmed = duration.trim();
    if (!isNaN(Number(trimmed))) return parseInt(trimmed, 10);
    const match = trimmed.match(/^(\d+)([smhd])$/);
    if (!match) return 0;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case "s": return value;
        case "m": return value * 60;
        case "h": return value * 60 * 60;
        case "d": return value * 24 * 60 * 60;
        default: return 0;
    }
}

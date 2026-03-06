// Authentication Constants
// This file is safe for use in both Node.js and Edge runtimes (no Node.js built-in dependencies)

export const COOKIES = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
} as const;

export const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
export const REFRESH_EXPIRY_DAYS = 7;

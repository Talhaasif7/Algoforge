import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../db/prisma";
import { ACCESS_EXPIRY, REFRESH_EXPIRY_DAYS } from "./constants";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRY as any,
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getUser(token: string) {
  try {
    const payload = verifyAccessToken(token);
    return await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      }
    });
  } catch (err) {
    return null;
  }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function getRefreshTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REFRESH_EXPIRY_DAYS);
  return expiry;
}

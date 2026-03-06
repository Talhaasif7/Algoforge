import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from "@/lib/auth/jwt";
import { registerSchema } from "@/lib/validations/auth";
import { successResponse, validationErrorResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { setAuthCookies } from "@/lib/auth/cookies";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse("Invalid input", parsed.error.flatten().fieldErrors);
    }

    const { email, username, password, name } = parsed.data;

    // Check existing user
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      const field = existing.email === email ? "email" : "username";
      return errorResponse("CONFLICT", `A user with this ${field} already exists`, 409);
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        passwordHash,
        emailVerifyToken,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Set the cookies using helper
    await setAuthCookies(accessToken, refreshToken, user.id, "User registered");

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          role: user.role,
        },
        accessToken,
      },
      201
    );
  } catch (error) {
    logger.error("Registration failed", error);
    return errorResponse("INTERNAL_ERROR", "Registration failed", 500);
  }
}

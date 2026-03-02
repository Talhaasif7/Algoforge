import { prisma } from "@/lib/db/prisma";
import { comparePassword } from "@/lib/auth/password";
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validations/auth";
import { successResponse, validationErrorResponse, errorResponse } from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse("Invalid input", parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }

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

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info("User logged in", { userId: user.id });

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    logger.error("Login failed", error);
    return errorResponse("INTERNAL_ERROR", "Login failed", 500);
  }
}

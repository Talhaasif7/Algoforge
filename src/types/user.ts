export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  role: "USER" | "ADMIN";
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

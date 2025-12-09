// Utilitários para JWT
import jwt from "jsonwebtoken";
import { UserType } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "JWT_SECRET e JWT_REFRESH_SECRET devem estar definidos no .env"
  );
}

export interface JWTPayload {
  userId: string;
  userType: UserType;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Gerar access token (15 minutos)
 */
export const generateAccessToken = (
  userId: string,
  userType: UserType
): string => {
  return jwt.sign({ userId, userType }, JWT_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Gerar refresh token (7 dias)
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Gerar ambos os tokens (access + refresh)
 */
export const generateTokens = (
  userId: string,
  userType: UserType
): { accessToken: string; refreshToken: string; expiresIn: number } => {
  const accessToken = generateAccessToken(userId, userType);
  const refreshToken = generateRefreshToken(userId);

  return {
    accessToken,
    refreshToken,
    expiresIn: 900, // 15 minutos em segundos
  };
};

/**
 * Verificar e decodificar access token
 */
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};

/**
 * Verificar e decodificar refresh token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    throw new Error("Refresh token inválido ou expirado");
  }
};


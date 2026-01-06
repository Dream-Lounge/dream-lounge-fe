import type { User } from "./api";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

export function getStoredUser(): User | null {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) !== null;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

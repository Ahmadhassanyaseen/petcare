import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export type JwtPayload = {
  sub: string; // user id
  email: string;
  name?: string;
};

export function signAuthToken(payload: JwtPayload) {
  if (!JWT_SECRET) throw new Error("Missing JWT_SECRET env var");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): JwtPayload | null {
  if (!JWT_SECRET) throw new Error("Missing JWT_SECRET env var");
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.set("auth_token", "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getAuthFromCookies(): Promise<JwtPayload | null> {
  const store = await cookies();
  const token = store.get("auth_token")?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

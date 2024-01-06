"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { updateCookies } from "./cookies";
import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

type NewAccessTokenProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

export const newAccessToken = ({
  id,
  email,
  avatarUrl,
}: NewAccessTokenProps) => {
  return jwt.sign(
    { id, email, avatarUrl, exp: Math.floor(Date.now() / 1000) + 600 },
    process.env.REFRESH_TOKEN!
  );
};

export const refreshAccessToken = async (): Promise<string> => {
  const prevAccessToken = cookies().get("accessToken")?.value;
  const userDetails = jwt.decode(prevAccessToken!) as UserDetailsProps;
  const newAccessToken = jwt.sign(
    { ...userDetails, exp: Math.floor(Date.now() / 1000) + 600 },
    process.env.REFRESH_TOKEN!
  );
  updateCookies("accessToken", newAccessToken);
  return newAccessToken;
};

export const decodeUserToken = async () => {
  return jwt.decode(cookies().get("accessToken")!.value) as UserDetailsProps;
};

export const verifyToken = async (token: string) => {
  try {
    jwt.verify(token, process.env.REFRESH_TOKEN!);
    const user = jwt.decode(token) as UserDetailsProps;
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.email, user.email));
    updateCookies("accessToken", token);
    return "verification successful";
  } catch (err) {
    return "verification failed";
  }
};

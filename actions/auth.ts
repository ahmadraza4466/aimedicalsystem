"use server";

import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
const CryptoJS = require("crypto-js");

const encryptPassword = async (plainPassword: string) => {
  return await CryptoJS.AES.encrypt(
    plainPassword,
    process.env.SECRET_KEY!
  ).toString();
};

const decryptPassword = async (password: string) => {
  return await CryptoJS.AES.decrypt(password, process.env.SECRET_KEY!).toString(
    CryptoJS.enc.Utf8
  );
};

const updateCookies = (name: string, value: string) => {
  return cookies().set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
  });
};

type NewAccessTokenProps = {
  id: string;
  email: string;
  avatarUrl: string;
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

type LoginProps = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginProps) => {
  const user = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.email, email));

  if (user.length !== 0) {
    const plainPassword = await decryptPassword(user[0].password);
    if (plainPassword === password) {
      const accessToken = newAccessToken({
        id: user[0].id,
        email: user[0].email,
        avatarUrl: user[0].avatarUrl,
      });
      updateCookies("accessToken", accessToken);
      return "Login successful";
    } else {
      return "Email or password is incorrect";
    }
  } else {
    return "User does not exist";
  }
};

type SignupProps = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const signup = async ({
  username,
  email,
  password,
  confirmPassword,
}: SignupProps) => {
  try {
    if (password !== confirmPassword) return "Passwords do not match";

    const existingUser = await db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.email, email));

    if (existingUser.length !== 0) {
      return "User already exists";
    } else {
      const encryptedPassword = await encryptPassword(password);
      const avatarUrl = faker.image.avatarGitHub();
      await db.insert(users).values({
        name: username,
        email: email,
        password: encryptedPassword,
        avatarUrl: avatarUrl,
      });

      const newUser = await db
        .select()
        .from(users)
        .limit(1)
        .where(eq(users.email, email));

      const accessToken = newAccessToken({
        id: newUser[0].id,
        email: newUser[0].email,
        avatarUrl: newUser[0].avatarUrl,
      });

      updateCookies("accessToken", accessToken);

      return "Signup successful";
    }
  } catch (err) {
    return "Something went wrong, please try again later 🤕";
  }
};

export const logout = async () => {
  cookies().delete("accessToken");
  redirect("/auth/login");
};

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
};

export const getUserDetails = async (): Promise<UserDetailsProps> => {
  const userDetails = jwt.decode(
    cookies().get("accessToken")!.value
  ) as UserDetailsProps;
  return userDetails;
};

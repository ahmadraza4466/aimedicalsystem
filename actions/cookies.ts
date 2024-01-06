"use server";

import { cookies } from "next/headers";

export const updateCookies = (name: string, value: string) => {
  return cookies().set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    path: "/",
  });
};

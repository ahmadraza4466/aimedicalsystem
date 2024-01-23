import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
const CryptoJS = require("crypto-js");
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { newAccessToken, setCookies, verifyEmail } from "../route";

export async function POST(req: NextRequest) {
  const userData = await req.json();
  if (!userData.email || !userData.password)
    return Response.json(
      { message: "email or password is invalid" },
      { status: 400 }
    );

  const user = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.email, userData.email));

  if (user.length === 0)
    return Response.json({ message: "user does not exist" }, { status: 404 });

  const plainPassword = await CryptoJS.AES.decrypt(
    user[0].password,
    process.env.SECRET_KEY!
  ).toString(CryptoJS.enc.Utf8);

  if (plainPassword !== userData.password)
    return Response.json(
      { message: "email or password is incorrect" },
      { status: 400 }
    );

  const accessToken = newAccessToken({
    id: user[0].id,
    email: user[0].email,
    avatarUrl: user[0].avatarUrl,
    emailVerified: user[0].emailVerified!,
  });

  setCookies("accessToken", accessToken);

  if (user[0].emailVerified !== true) {
    verifyEmail(user[0].email);
    return Response.json({ message: "email not verified" });
  }

  return Response.json({ message: "login successful" }, { status: 200 });
}

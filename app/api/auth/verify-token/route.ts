import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  try {
    jwt.verify(token, process.env.REFRESH_TOKEN!);
    const user = jwt.decode(token) as UserDetailsProps;
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.email, user.email));

    cookies().set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });

    return Response.json({ message: "verification successful" });
  } catch (err) {
    return Response.json({ message: "verification failed" });
  }
}

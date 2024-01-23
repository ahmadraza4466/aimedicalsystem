import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import {
  encryptPassword,
  newAccessToken,
  setCookies,
  verifyEmail,
} from "../route";
import { faker } from "@faker-js/faker";

export async function POST(req: NextRequest) {
  const userData = await req.json();
  if (userData.password !== userData.confirmPassword)
    return Response.json(
      { message: "passwords do not match" },
      { status: 400 }
    );

  if (Object.values(userData).some((v) => v === null || v === ""))
    return Response.json(
      { message: "please fill all fields" },
      { status: 400 }
    );

  const existingUser = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.email, userData.email));

  if (existingUser.length !== 0) {
    return Response.json({ message: "user already exists" }, { status: 400 });
  } else {
    const encryptedPassword = await encryptPassword(userData.password);
    const avatarUrl = faker.image.avatarGitHub();
    await db.insert(users).values({
      name: userData.username,
      email: userData.email,
      password: encryptedPassword,
      avatarUrl: avatarUrl,
    });

    const newUser = await db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.email, userData.email));

    const accessToken = newAccessToken({
      id: newUser[0].id,
      email: newUser[0].email,
      avatarUrl: newUser[0].avatarUrl,
      emailVerified: newUser[0].emailVerified!,
    });

    setCookies("accessToken", accessToken);
    verifyEmail(newUser[0].email);

    return Response.json(
      { message: "verification email sent" },
      { status: 201 }
    );
  }
}

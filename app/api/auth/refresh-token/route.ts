import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

export async function GET() {
  try {
    const prevAccessToken = cookies().get("accessToken")?.value;
    const userDetails = jwt.decode(prevAccessToken!) as UserDetailsProps;
    const newAccessToken = jwt.sign(
      { ...userDetails, exp: Math.floor(Date.now() / 1000) + 600 },
      process.env.REFRESH_TOKEN!
    );
    cookies().set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });
    return Response.json({ token: newAccessToken });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

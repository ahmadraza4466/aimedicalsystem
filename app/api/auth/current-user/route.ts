import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

export async function GET() {
  const user = jwt.decode(
    cookies().get("accessToken")!.value
  ) as UserDetailsProps;
  return Response.json({ user });
}

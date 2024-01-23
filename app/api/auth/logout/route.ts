import { cookies } from "next/headers";

export async function GET() {
  cookies().delete("accessToken");
  return Response.json({ message: "request successful" }, { status: 200 });
}

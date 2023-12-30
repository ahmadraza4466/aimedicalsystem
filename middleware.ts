import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export default async function middleware(req: NextRequest) {
  const accessToken = cookies().get("accessToken")?.value;
  const isAuthenticated = !!accessToken;
  const url = req.url;

  if (url.includes("/auth") && isAuthenticated) {
    return NextResponse.redirect("http://localhost:3000/chats");
  } else if (!url.includes("/auth") && !isAuthenticated) {
    return NextResponse.redirect("http://localhost:3000/auth/login");
  }
}

export const config = {
  matcher: ["/auth/:path*", "/chats"],
};

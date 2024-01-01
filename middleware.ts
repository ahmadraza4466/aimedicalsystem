import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export default async function middleware(req: NextRequest) {
  const isAuthenticated = !!cookies().get("accessToken")?.value;
  const url = req.url;

  if (url.includes("/auth") && isAuthenticated) {
    return NextResponse.redirect(new URL("/chats", url));
  } else if (!url.includes("/auth") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", url));
  }
}

export const config = {
  matcher: ["/auth/:path*", "/chats"],
};

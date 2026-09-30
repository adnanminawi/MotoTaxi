import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/driver/login", "/api/drivers/login"];
  if (publicPaths.includes(pathname)) {
   return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const isApi = pathname.startsWith("/api");   // ← the branch

  if (!token) {
    return isApi
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/driver/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return isApi
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/driver/login", request.url));
  }
}

export const config = {
  matcher: ["/driver/:path*", "/api/drivers/:path*"],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/driver/login",
    "/api/drivers/login",
    "/admin/login",
    "/api/admin/login",
  ];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const isAdminRoute =
  pathname.startsWith("/admin") ||
  pathname.startsWith("/api/admin") ||
  pathname.startsWith("/api/customer");
  const token = request.cookies.get("token")?.value;
  const isApi = pathname.startsWith("/api");
  const loginUrl = isAdminRoute ? "/admin/login" : "/driver/login";

  if (!token) {
    return isApi
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL(loginUrl, request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (isAdminRoute && payload.role !== "admin") {
      return isApi
        ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
        : NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return isApi
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL(loginUrl, request.url));
  }
}

export const config = {
  matcher: [
    "/driver/:path*",
    "/api/drivers/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/customer/:path*",
  ],
};
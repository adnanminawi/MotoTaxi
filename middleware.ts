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

  const isApi = pathname.startsWith("/api");
  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/customer");

  // each area has its own cookie and required role
  const cookieName = isAdminRoute ? "admin_token" : "driver_token";
  const requiredRole = isAdminRoute ? "admin" : "driver";
  const loginUrl = isAdminRoute ? "/admin/login" : "/driver/login";

  const reject = () =>
    isApi
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL(loginUrl, request.url));

  const token = request.cookies.get(cookieName)?.value;
  if (!token) return reject();

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== requiredRole) return reject();
    return NextResponse.next();
  } catch {
    return reject();
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
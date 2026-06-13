import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [
  "/dashboard",
  "/medications",
  "/labs",
  "/nutrition",
  "/messages",
  "/appointments",
  "/ai-assistant",
  "/profile",
  "/doctor",
  "/dietitian",
  "/coordinator",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const session = request.cookies.get("renacare-auth");
  if (!session?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/medications/:path*",
    "/labs/:path*",
    "/nutrition/:path*",
    "/messages/:path*",
    "/appointments/:path*",
    "/ai-assistant/:path*",
    "/profile/:path*",
    "/doctor/:path*",
    "/dietitian/:path*",
    "/coordinator/:path*",
  ],
};

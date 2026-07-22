import { NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/register",
  "/admin/login",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/admin/login",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Root page - always allow (client-side handles redirect)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Check for token in cookie
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // For pages, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Basic validation: token should have 3 parts (header.payload.signature)
  const parts = token.split(".");
  if (parts.length !== 3) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check token expiry by decoding payload
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      // Token expired
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // Invalid payload
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, _next, and favicon
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


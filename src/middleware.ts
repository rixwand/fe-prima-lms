import { getToken } from "next-auth/jwt";
import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { AUTH_SECRET } from "./config/env";

const AUTH_PREFIX = "/auth";
const PROTECTED_PREFIX = ["/dashboard", "/learn"];
const INSTRUCTOR_PREFIX = ["/instructor"];
const ADMIN_PREFIX = ["/admin"];

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some(p => pathname.startsWith(p));
}

function buildLoginRedirect(req: NextRequest, to = "/auth/login") {
  const url = new URL(to, req.url);
  url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const token = await getToken({
    req,
    secret: AUTH_SECRET,
  });
  const isAuthed = !!token;
  const role = token?.role;

  if (pathname.startsWith(AUTH_PREFIX) && isAuthed) return NextResponse.redirect(new URL("/", req.url));

  if (startsWithAny(pathname, PROTECTED_PREFIX)) {
    if (!isAuthed) return buildLoginRedirect(req);
    if (role === "lecturer") return NextResponse.redirect(new URL("/instructor/dashboard", req.url));
    if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (startsWithAny(pathname, INSTRUCTOR_PREFIX)) {
    if (!isAuthed) return buildLoginRedirect(req);
    if (role != "lecturer") {
      return NextResponse.rewrite(new URL("/403", req.url));
    }
  }

  if (startsWithAny(pathname, ADMIN_PREFIX)) {
    if (!isAuthed) return buildLoginRedirect(req);
    if (role != "admin") {
      return NextResponse.rewrite(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: ["/auth/:path*", "/dashboard/:path*", "/instructor/:path*", "/admin/:path*", "/learn/:path*"],
};

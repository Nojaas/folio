import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Clean URL: /fr → /
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fr/, "") || "/";
    return NextResponse.redirect(url);
  }

  // EN stays under /en
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const response = NextResponse.next();
    response.headers.set("x-locale", "en");
    return response;
  }

  // FR has no prefix — rewrite to /fr internally
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fr" : `/fr${pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-locale", "fr");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

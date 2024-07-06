// middleware.js
import { auth } from "./auth";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

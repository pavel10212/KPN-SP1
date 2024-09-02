// middleware.js
import { auth } from "./auth";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // List of public routes
  const publicRoutes = ["/login", "/register", "/"]; // Add other public routes as needed

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect private routes
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

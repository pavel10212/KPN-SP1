import { auth } from "./auth";
import { NextResponse } from "next/server";

export default async function middleware(request) {
    try {
        console.log("Middleware started");
        const session = await auth();
        console.log("Session:", JSON.stringify(session));

        const { pathname } = request.nextUrl;
        console.log("Pathname:", pathname);

        const publicRoutes = ["/login", "/register", "/"];

        if (publicRoutes.includes(pathname)) {
            console.log("Public route accessed");
            return NextResponse.next();
        }

        if (!session || !session.user) {
            console.log("No session or user, redirecting to login");
            return NextResponse.redirect(new URL("/login", request.url));
        }

        console.log("Session valid, proceeding");
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon\\.ico|logo.*).*)",
    ],
};
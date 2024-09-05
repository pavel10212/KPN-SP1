import {NextResponse} from "next/server";
import {auth} from "./auth";

export default async function middleware(request) {
    try {
        const session = await auth();
        const {pathname, origin} = request.nextUrl;

        // List of public routes
        const publicRoutes = ["/login", "/register", "/"];

        // Allow public routes
        if (publicRoutes.includes(pathname)) {
            return NextResponse.next();
        }

        // Protect private routes
        if (!session) {
            return NextResponse.redirect(`${origin}/login`);
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.error();
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo).*)"],
};
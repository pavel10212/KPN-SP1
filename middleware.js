import {auth} from "./auth";
import {NextResponse} from "next/server";

export default async function middleware(request) {
    try {

        const session = await auth();
        console.log("session", session)
        const {pathname} = request.nextUrl;

        const publicRoutes = ["/login", "/register", "/"];

        if (publicRoutes.includes(pathname)) {
            return NextResponse.next();
        }

        if (!session || !session.user) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    }  catch (error) {
        console.log("Middleware error", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

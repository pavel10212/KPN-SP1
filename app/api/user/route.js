import {NextResponse} from "next/server";
import {auth} from "@/auth";
import prisma from "@/app/api/prismaClient";

export async function GET() {
    const session = await auth();
    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email,
        },
        include: {
            team: true
        }
    });
    return NextResponse.json(user);
}
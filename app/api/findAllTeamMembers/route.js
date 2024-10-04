import prisma from "@/app/api/prismaClient";
import {auth} from "@/auth";
import {findUserById} from "@/lib/utils";
import {NextResponse} from "next/server";

export async function GET() {
    const session = await auth();
    const user = await findUserById(session.user.id);
    const allUsers = await prisma.User.findMany({
        where: {
            teamId: user.teamId,
        },
    });
    return NextResponse.json(allUsers);
}

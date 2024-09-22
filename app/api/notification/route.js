import prisma from 'app/api/prismaClient'
import {NextResponse} from "next/server";
import {auth} from 'auth'
import {findUserByEmail} from "@/lib/utils";

export async function GET() {
    const session = await auth()
    const user = await findUserByEmail(session.user.email)
    const teamId = user.teamId
    const userRole = session.user.role

    const notifications = await prisma.notification.findMany({
        where: {
            teamId,
            role: userRole
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (!notifications) {
        return NextResponse.json({message: "No notifications found"}, {status: 404})
    }
    return NextResponse.json(notifications)
}
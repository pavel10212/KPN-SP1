import prisma from 'app/api/prismaClient'
import {NextResponse} from "next/server";
import {auth} from 'auth'

export async function GET() {
    const session = await auth()
    const {id: userId, role: userRole} = session.user

    const notifications = await prisma.notification.findMany({
        where: {userId, role: userRole},
        orderBy: {createdAt: 'desc'},
        take: 5,
        select: {
            id: true,
            title: true,
            message: true,
            createdAt: true,
            isRead: true
        }
    })

    if (!notifications) {
        return NextResponse.json({message: "No notifications found"}, {status: 404})
    }

    return NextResponse.json(notifications)
}

export async function POST(request) {
    const {notificationIds} = await request.json()
    const session = await auth()
    const {id: userId, role: userRole} = session.user

    await prisma.notification.updateMany({
        where: {id: {in: notificationIds}, userId, role: userRole},
        data: {isRead: true}
    })

    return NextResponse.json({message: "Notifications marked as read"})
}
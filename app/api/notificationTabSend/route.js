import {NextResponse} from "next/server";
import prisma from "app/api/prismaClient";
import {auth} from 'auth';
import {findUserById} from "@/lib/utils";

export async function POST(req) {
    try {
        const {title, message} = await req.json();
        const who = new URL(req.url).searchParams.get('who');

        const session = await auth();
        const currentUser = await findUserById(session.user.id);

        const roleMap = {
            "CoHostMaid": ["Co-Host", "Maid"],
            "Driver": ["Driver"],
            "Maintenance": ["Maintenance"]
        };

        const targetRoles = roleMap[who];
        if (!targetRoles) {
            return NextResponse.json({error: "Invalid target"}, {status: 400});
        }

        const teamUsers = await prisma.user.findMany({
            where: {
                teamId: currentUser.teamId,
                role: {in: targetRoles},
                id: {not: currentUser.id}
            }
        });

        const notifications = await Promise.all(teamUsers.map(teamUser =>
            prisma.notification.create({
                data: {
                    userId: teamUser.id,
                    role: teamUser.role,
                    title,
                    message,
                }
            })
        ));

        return NextResponse.json({message: "Notifications sent", count: notifications.length}, {status: 200});
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({error: "Failed to send notification"}, {status: 500});
    }
}
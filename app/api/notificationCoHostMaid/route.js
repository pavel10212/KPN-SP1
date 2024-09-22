import {NextResponse} from "next/server";
import prisma from "app/api/prismaClient";
import {auth} from 'auth';
import {findUserByEmail} from "@/lib/utils";

export async function POST(req) {
    try {
        const body = await req.json();
        const {title, message} = body;
        const roles = ["Maid", "Co-Host"];

        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const user = await findUserByEmail(session.user.email);
        if (!user || !user.teamId) {
            return NextResponse.json({error: "User or team not found"}, {status: 404});
        }

        const notifications = await Promise.all(roles.map(role =>
            prisma.notification.create({
                data: {
                    teamId: user.teamId,
                    role,
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
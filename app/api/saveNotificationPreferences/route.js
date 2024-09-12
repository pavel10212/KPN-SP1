import {auth} from "@/auth";
import prisma from "@/app/api/prismaClient";
import {NextResponse} from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const userId = session.user.id

        const updateData = {
            FCMpreferences: body.fcm
        };
        if (body.fcmToken) {
            updateData.FCMToken = body.fcmToken;
        }

        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: updateData,
        });

        return NextResponse.json(
            {
                message: "User preferences updated successfully",
                fcmEnabled: body.fcm,
                fcm: body.fcmToken,
                user: updatedUser
            },
            {status: 200}
        );

    } catch (e) {
        console.error("Error updating user:", e);
        return NextResponse.json(
            {message: "Failed to update user", error: e.message},
            {status: 500}
        );
    }
}
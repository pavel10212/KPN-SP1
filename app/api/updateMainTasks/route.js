import prisma from "../prismaClient";
import {auth} from "@/auth";

export async function POST(req) {
    try {
        const body = await req.json();
        const {id, status} = body;
        const session = await auth();

        if (!id) {
            return new Response(
                JSON.stringify({
                    message: "Booking ID is required",
                }),
                {status: 400, headers: {"Content-Type": "application/json"}}
            );
        }

        const updateData = {};

        if (status) {
            updateData.status = status;
        }

        ["roomId", "guestName", "customNotes"].forEach((field) => {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        });

        ["firstNight", "lastNight"].forEach((field) => {
            if (body[field]) {
                const date = new Date(body[field]);
                if (!isNaN(date.getTime())) {
                    updateData[field] = date;
                }
            }
        });

        const updatedBooking = await prisma.booking.update({
            where: {id},
            data: updateData,
        });

        const userId = session.user.id;

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                teamId: true,
            },
        });
        const teamId = user.teamId;

        const notificationTitle = "Booking Update";
        const notificationBody = `Booking ${id} has been updated. Status: ${status}`;

        const roles = ['Maid', 'Co-Host'];
        for (const role of roles) {
            const topic = `team-${teamId}_${role}`;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sendTopicNotification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        topic,
                        title: notificationTitle,
                        body: notificationBody
                    })
                });

                if (!response.ok) {
                    throw new Error(`Failed to send notification to ${role}`);
                }

                console.log(`Notification sent successfully to ${role}`);
            } catch (error) {
                console.error(`Error sending notification to ${role}:`, error);
            }
        }

        return new Response(
            JSON.stringify({
                message: "Booking updated successfully",
                updatedBooking,
            }),
            {status: 200, headers: {"Content-Type": "application/json"}}
        );
    } catch (error) {
        console.error("Failed to update booking:", error);
        return new Response(
            JSON.stringify({
                message: "Failed to update booking",
                error: error.message,
            }),
            {status: 500, headers: {"Content-Type": "application/json"}}
        );
    }
}

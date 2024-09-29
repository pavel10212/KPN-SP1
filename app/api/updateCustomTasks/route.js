import prisma from "../prismaClient";
import {NextResponse} from "next/server";
import dayjs from "dayjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            id,
            taskTitle,
            taskDescription,
            role,
            guestFirstName,
            guestName,
            location,
            guestPhone,
            date,
            status,
        } = body;

        if (!id) {
            return NextResponse.json({error: "Missing task ID"}, {status: 400});
        }

        const updatedTask = await prisma.customTask.update({
            where: {id: id},
            data: {
                taskTitle,
                taskDescription,
                role,
                guestFirstName,
                guestName,
                location,
                guestPhone,
                date: dayjs(date).toDate().toISOString(),
                status,
            },
        });

        console.log("Custom task updated successfully:", updatedTask.id);


        return NextResponse.json(
            {success: true, task: updatedTask},
            {status: 200}
        );
    } catch (error) {
        console.error("Error updating custom task:", error);
        return NextResponse.json(
            {error: "Internal server error", details: error.message},
            {status: 500}
        );
    }
}

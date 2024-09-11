import prisma from "../prismaClient";
import {NextResponse} from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id) {
            return NextResponse.json(
                { message: "Booking ID is required" },
                { status: 400 }
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
            where: { id },
            data: updateData,
        });

        return NextResponse.json(
            { message: "Booking updated successfully", booking: updatedBooking },
            { status: 200 }
        );

    } catch (error) {
        console.error("Failed to update booking:", error);
        return NextResponse.json(
            { message: "Failed to update booking", error: error.message },
            { status: 500 }
        );
    }
}
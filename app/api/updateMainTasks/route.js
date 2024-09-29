import prisma from "../prismaClient";
import {NextResponse} from 'next/server';
import dayjs from "dayjs";

export async function POST(req) {
    try {
        const body = await req.json();
        const {id, status} = body;
        console.log(body, "body");
        const today = dayjs();

        if (!id) {
            return NextResponse.json(
                {message: "Booking ID is required"},
                {status: 400}
            );
        }

        const updateData = {};

        if (status) {
            updateData.status = status;
        }

        if (status === "In House") {
            updateData.firstNight = today.toISOString()
        } else if (status === "Departed") {
            updateData.lastNight = today.toISOString()
        }

        updateData["cleanStatus"] = body["cleanStatus"];

        console.log(updateData, "updateData");

        ["roomId", "guestName", "customNotes"].forEach((field) => {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        });


        const updatedBooking = await prisma.booking.update({
            where: {id},
            data: updateData,
        });

        console.log(updatedBooking, "updatedBooking");

        return NextResponse.json(
            {message: "Booking updated successfully", booking: updatedBooking},
            {status: 200}
        );

    } catch (error) {
        console.error("Failed to update booking:", error);
        return NextResponse.json(
            {message: "Failed to update booking", error: error.message},
            {status: 500}
        );
    }
}
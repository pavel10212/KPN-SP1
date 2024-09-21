import prisma from "@/app/api/prismaClient";
import {NextResponse} from "next/server";
import {createBookings} from "@/lib/actions";

export async function POST(request) {
    try {
        const {userId, bookingsData} = await request.json();

        if (!userId || !bookingsData || !Array.isArray(bookingsData)) {
            return NextResponse.json({error: "Invalid request data"}, {status: 400});
        }

        const teamUser = await prisma.user.findUnique({
            where: {id: userId},
            select: {teamId: true},
        });

        if (!teamUser) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        console.log("Received bookings:", bookingsData);

        const {successfulBookings, failedBookings} = await createBookings(bookingsData, teamUser.teamId);

        return NextResponse.json({
            success: successfulBookings,
            failed: failedBookings,
        });
    } catch (error) {
        console.error("Error in POST /api/createBookings:", error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
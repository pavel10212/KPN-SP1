import prisma from "@/app/api/prismaClient";
import {NextResponse} from "next/server";

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

        const createdBookings = await Promise.all(
            bookingsData.map(async (booking) => {
                if (booking.status === "1" || booking.status === "2") {
                    try {
                        return await prisma.booking.create({
                            data: {
                                bookId: booking.bookId,
                                roomId: booking.roomId,
                                firstNight: new Date(booking.firstNight),
                                lastNight: new Date(booking.lastNight),
                                numAdult: booking.numAdult,
                                numChild: booking.numChild,
                                guestFirstName: booking.guestFirstName,
                                guestName: booking.guestName,
                                guestEmail: booking.guestEmail,
                                guestPhone: booking.guestPhone,
                                teamId: teamUser.teamId,
                            },
                        });
                    } catch (error) {
                        console.error("Error creating booking:", error);
                        return {error: error.message, booking};
                    }
                }
                return null;
            })
        );

        const successfulBookings = createdBookings.filter(booking => booking && !booking.error);
        const failedBookings = createdBookings.filter(booking => booking && booking.error);

        console.log("Created bookings:", successfulBookings);
        if (failedBookings.length > 0) {
            console.error("Failed bookings:", failedBookings);
        }

        return NextResponse.json({
            success: successfulBookings,
            failed: failedBookings,
        });
    } catch (error) {
        console.error("Error in POST /api/createBookings:", error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
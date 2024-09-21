import prisma from "@/app/api/prismaClient";
import {NextResponse} from "next/server";
import {createBookings} from "@/lib/actions";

export async function POST(request) {
    try {
        const {teamId} = await request.json();

        if (!teamId) {
            return NextResponse.json({error: "Invalid request data"}, {status: 400});
        }

        const response = await fetch("https://api.beds24.com/json/getBookings", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                authentication: {
                    apiKey: process.env.API_KEY,
                    propKey: process.env.PROP_KEY,
                },
                includeInvoice: false,
                includeInfoItems: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const bookingsData = await response.json();
        console.log("Bookings fetched:", bookingsData.length);

        if (bookingsData.error) {
            console.error("Error fetching bookings:", bookingsData.error);
            return NextResponse.json({error: bookingsData.error}, {status: 500});
        }

        const existingBookings = await prisma.booking.findMany({
            where: {
                teamId,
            },
        });

        const newBookings = bookingsData.filter(booking =>
            !existingBookings.some(existing => existing.bookId === booking.bookId)
        );

        const {successfulBookings, failedBookings} = await createBookings(newBookings, teamId);

        return NextResponse.json({
            success: successfulBookings,
            failed: failedBookings,
        });
    } catch (error) {
        console.error("Error in POST /api/refreshBookings:", error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
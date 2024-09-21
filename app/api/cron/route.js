import prisma from "@/app/api/prismaClient";
import {NextResponse} from "next/server";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request) {
    try {

        const url = new URL(request.url);

        const secretToken = url.searchParams.get('secret');

        if (secretToken !== CRON_SECRET) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        console.log("Authentication successful");

        const teams = await prisma.team.findMany({
            select: {id: true},
        });

        console.log("Teams fetched:", teams.length);

        if (!teams || teams.length === 0) {
            console.error("No teams found");
            return NextResponse.json({error: "No teams found"}, {status: 404});
        }

        console.log("Fetching bookings from API");
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

        const data = await response.json();
        console.log("Bookings fetched:", data.length);

        if (data.error) {
            console.error("Error fetching bookings:", data.error);
            return NextResponse.json({error: data.error}, {status: 500});
        }

        console.log("Processing bookings");
        const results = await Promise.allSettled(
            data.flatMap(booking =>
                teams.map(async (team) => {
                    try {
                        return await prisma.booking.upsert({
                            where: {bookId: booking.bookId},
                            update: {
                                roomId: booking.roomId,
                                firstNight: new Date(booking.firstNight),
                                lastNight: new Date(booking.lastNight),
                                numAdult: booking.numAdult,
                                numChild: booking.numChild,
                                guestFirstName: booking.guestFirstName,
                                guestName: booking.guestName,
                                guestEmail: booking.guestEmail,
                                guestPhone: booking.guestPhone,
                                teamId: team.teamId,
                            },
                            create: {
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
                                teamId: team.teamId,
                            },
                        });
                    } catch (error) {
                        console.error("Error upserting booking:", error);
                        return {error: error.message, bookId: booking.bookId, teamId: team.teamId};
                    }
                })
            )
        );

        const successfulBookings = results.filter(r => r.status === 'fulfilled').map(r => r.value);
        const failedBookings = results.filter(r => r.status === 'rejected').map(r => r.reason);

        console.log("Successful bookings:", successfulBookings.length);
        console.log("Failed bookings:", failedBookings.length);

        return NextResponse.json({
            successful: successfulBookings.length,
            failed: failedBookings.length,
            failedDetails: failedBookings
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({error: "An unexpected error occurred", details: error.message}, {status: 500});
    }
}
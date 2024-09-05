import prismaClient from "@/app/api/prismaClient";
import {NextResponse} from "next/server";
import {auth} from "@/auth.js";


export async function POST() {
    const user = await auth();

    if (!user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    //delete all bookings
    await prismaClient.booking.deleteMany();

    const teamuser = await prismaClient.user.findFirst({
        where: {email: user.email},
        select: {
            teamId: true,
        },
    });

    //Pull the bookings again
    const response = await fetch("https://api.beds24.com/json/getBookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            authentication: {
                apiKey: process.env.API_KEY,
                propKey: process.env.PROP_KEY,
            },
            includeInvoice: false,
            includeInfoItems: false,
        }),
    });

    //push the new bookings back to DB
    const data = await response.json();

    if (data.error) {
        console.error("Error fetching bookings:", data.error);
        return NextResponse.json({error: data.error}, {status: 500});
    }


    const createdBookings = await Promise.all(
        data.map(async (booking) => {
            try {
                return await prismaClient.booking.create({
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
                        teamId: teamuser.teamId,
                    },
                });
            } catch (error) {
                console.error("Error creating booking:", error);
                throw error;
            }
        })
    );
    console.log("Created bookings:", createdBookings);
    return NextResponse.json(createdBookings);
}

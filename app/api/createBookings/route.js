import prisma from "@/app/api/prismaClient";
import { NextResponse } from "next/server";
import { auth } from "@/auth.js";

export async function POST(request) {
  const session = await auth();
  const teamuser = await prisma.user.findFirst({
    where: { email: session.user.email },
    select: {
      teamId: true,
    },
  });

  console.log(teamuser);
  try {
    const bookings = await request.json();
    console.log("Received bookings:", bookings);

    const createdBookings = await Promise.all(
      bookings.map(async (booking) => {
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
  } catch (error) {
    console.error("Error in POST /api/createBookings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

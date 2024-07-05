import prisma from "@/app/api/prismaClient.js";
import { hash } from "bcryptjs";
import { registerSchema } from "./zod";
import { z } from "zod";

export async function pullFromDatabaseForDash() {
  const bookings = await prisma.booking.groupBy({
    by: ["guestFirstName", "guestName", "roomId"], // Include "Room" in the grouping
    _min: {
      firstNight: true,
    },
    _max: {
      lastNight: true,
    },
    orderBy: {
      _min: {
        firstNight: "asc",
      },
    },
    take: 10,
  });

  const transformedBookings = bookings.map((booking) => ({
    // Assuming each booking in the group is unique and you want to display a representative ID, you might need a different approach
    guestFirstName: `${booking.guestFirstName} ${booking.guestName}`,
    roomId: booking.roomId,
    firstNight: booking._min.firstNight,
    lastNight: booking._max.lastNight,
  }));

  return transformedBookings;
}


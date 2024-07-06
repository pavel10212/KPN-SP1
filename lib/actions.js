import prisma from "@/app/api/prismaClient.js";

export async function pullFromDatabase(teamId, sort) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  const bookings = await prisma.booking.groupBy({
    by: ["guestFirstName", "guestName", "roomId", "status"],
    _min: {
      firstNight: true,
    },
    _max: {
      lastNight: true,
    },
    orderBy: {
      [sort === "firstNight" ? "_min" : "_max"]: {
        [sort]: "asc",
      },
    },
    where: {
      AND: [
        {
          [sort]: {
            gte: todayISO,
          },
        },
        {
          teamId: teamId,
        },
      ],
    },
    take: 5,
  });
  const transformedBookings = bookings.map((booking) => ({
    guestFirstName: `${booking.guestFirstName} ${booking.guestName}`,
    roomId: booking.roomId,
    firstNight: booking._min.firstNight,
    lastNight: booking._max.lastNight,
    status: booking.status,
  }));

  return transformedBookings;
}

export async function pullAllBookings(teamId) {
  const bookings = await prisma.booking.findMany({
    where: {
      teamId: teamId,
    },
  });
  return bookings;
}

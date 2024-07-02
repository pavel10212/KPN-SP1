import prisma from "@/app/api/prismaClient.js";

export async function pushBookings() {
  const response = await fetch("/app/api/data/route.js", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);

  for (const item of data) {
    await prisma.booking.create({
      data: {
        bookId: item.bookId,
        roomId: item.roomId,
        firstNight: item.firstNight,
        lastNight: item.lastNight,
        numAdult: item.numAdult,
        numChild: item.numChild,
        guestFirstName: item.guestFirstName,
        guestName: item.guestName,
        guestEmail: item.guestEmail,
        guestPhone: item.guestPhone,
        guestNote: item.guestNote,
      },
    });
  }
}

export async function pullFromDatabase() {
  const bookings = await prisma.booking.findMany();
  return bookings;
}

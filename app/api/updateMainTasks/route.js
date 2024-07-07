import prisma from "../prismaClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      id,
      roomId,
      guestName,
      firstNight,
      lastNight,
      customNotes,
      status,
    } = body;

    const updatedBooking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        roomId,
        guestName,
        firstNight: new Date(firstNight),
        lastNight: new Date(lastNight),
        customNotes,
        status,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Booking updated successfully",
        updatedBooking,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to update booking:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to update booking",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

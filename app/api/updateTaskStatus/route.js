import prisma from "../prismaClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, newStatus, customNotes } = body;
    const updateData = {
      status: newStatus,
    };

    if (customNotes !== undefined) {
      updateData.customNotes = customNotes;
    }

    const updatedBooking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: updateData,
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

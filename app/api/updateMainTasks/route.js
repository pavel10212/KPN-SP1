import prisma from "../prismaClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return new Response(
        JSON.stringify({
          message: "Booking ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updateData = {};

    if (status) {
      updateData.status = status;
    }

    // Only include other fields if they are provided and valid
    ["roomId", "guestName", "customNotes"].forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Handle date fields separately
    ["firstNight", "lastNight"].forEach((field) => {
      if (body[field]) {
        const date = new Date(body[field]);
        if (!isNaN(date.getTime())) {
          updateData[field] = date;
        }
      }
    });

    const updatedBooking = await prisma.booking.update({
      where: { id },
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

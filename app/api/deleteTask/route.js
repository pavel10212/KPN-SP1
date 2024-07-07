import prisma from "../prismaClient";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    const deletedBooking = await prisma.booking.delete({
      where: {
        id: id,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Task deleted successfully",
        deletedBooking,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to delete task:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to delete task",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

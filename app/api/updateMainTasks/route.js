import prisma from "../prismaClient";
import { NextResponse } from 'next/server';
import dayjs from "dayjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, status } = body;
    console.log(body, "body");

    if (!id) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const updateData = {};

    const currentBooking = await prisma.booking.findUnique({
      where: { id },
      select: { status: true }
    });

    if (status && status !== currentBooking.status) {
      updateData.status = status;
      updateData.updatedAt = dayjs().toISOString();
    }

    updateData.cleanStatus = body.cleanStatus;

    ["roomId", "guestName", "customNotes"].forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Booking updated successfully", booking: updatedBooking },
      { status: 200 }
    );

  } catch (error) {
    console.error("Failed to update booking:", error);
    return NextResponse.json(
      { message: "Failed to update booking", error: error.message },
      { status: 500 }
    );
  }
}

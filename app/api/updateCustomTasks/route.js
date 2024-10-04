import prisma from "../prismaClient";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    const currentTask = await prisma.customTask.findUnique({
      where: { id: id },
    });

    const updateData = {};

    if (status !== undefined && status !== currentTask.status) {
      updateData.updatedAt = dayjs().toISOString();
      updateData.status = status;
    }

    ["taskTitle", "taskDescription", "role", "guestFirstName", "guestName", "location", "guestPhone", "date"].forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    console.log("Updating custom task with data:", updateData);

    const updatedTask = await prisma.customTask.update({
      where: { id },
      data: updateData,
    });

    console.log("Custom task updated successfully:", updatedTask.id);

    return NextResponse.json(
      { success: true, task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating custom task:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

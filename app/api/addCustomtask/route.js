import prisma from "../prismaClient";
import {NextResponse} from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      taskTitle,
      taskDescription,
      role,
      guestFirstName,
      guestName,
      location,
      guestPhone,
      date,
    } = body.data;
    try {
      await prisma.customTask.create({
        data: {
          role: role,
          taskTitle: taskTitle,
          taskDescription: taskDescription,
          status: "Assigned",
          guestFirstName: guestFirstName,
          guestName: guestName,
          location: location,
          guestPhone: guestPhone,
          date: date,
        },
      });
      console.log("Custom task created successfully");
      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error creating custom task:", error);
      throw error;
    }
  } catch (error) {
    console.log("Internal server error", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}

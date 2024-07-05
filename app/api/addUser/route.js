import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "../prismaClient";
import { hash } from "bcrypt";
import { registerSchema } from "@/lib/zod";

export async function POST(req) {
  try {
    const body = await req.json();
    const sessionEmail = body.session.user.email;
    const role = body.role;
    const { email, password, name } = registerSchema.parse(body);
    const user1 = await prisma.user.findUnique({
      where: {
        email: sessionEmail,
      },
    });

    const teamId = user1.teamId;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await hash(password, 10);
    console.log("Hashed password");
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
        role: role,
        team: {
          connect: { id: teamId },
        },
      },
    });
    console.log("User created successfully");

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.log("Internal server error", error); // Add this line
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

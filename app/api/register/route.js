import { NextResponse } from "next/server";
import prisma from "../prismaClient";
import { hash } from "bcrypt";
import { z } from "zod";
import { registerSchema } from "@/lib/zod";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await hash(password, 10);
    console.log("Hashed password");
    const team = await prisma.team.create({
      data: { name: `${name}'s Team` },
    });
    const user = await prisma.user.create({
      data: { name, email, hashedPassword: hashedPassword, teamId: team.id },
    });
    console.log("Team created successfully");

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Detailed error:", error); // Add this line
    console.log("Internal server error");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

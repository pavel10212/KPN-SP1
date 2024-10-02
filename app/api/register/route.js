import { NextResponse } from "next/server";
import prisma from "../prismaClient";
import { hash } from "bcrypt";
import { z } from "zod";
import { registerSchema } from "@/lib/zod";
import crypto from "crypto";
import { database } from "@/lib/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);
    const { api_key, prop_key } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const chatEngineSecret = crypto.randomBytes(16).toString("hex");

    let team;
    let user;

    try {
      const result = await prisma.$transaction(async (prisma) => {
        team = await prisma.team.create({
          data: {
            name: `${name}'s Team`,
            api_key,
            prop_key,
          },
        });

        user = await prisma.user.create({
          data: {
            name,
            email,
            hashedPassword,
            teamId: team.id,
            chatEnginePassword: chatEngineSecret,
          },
          include: { team: true },
        });

        return { team, user };
      });

      team = result.team;
      user = result.user;
    } catch (error) {
      console.error("Error creating team or user:", error);
      return NextResponse.json(
        { error: "Failed to create team or user" },
        { status: 500 }
      );
    }

    console.log("User and team created successfully");

    try {
      const docRef = doc(database, "users", user.id);
      await setDoc(docRef, {
        userId: user.id,
        email,
        name,
        role: user.role,
        team: {
          id: team.id,
          name: team.name,
          messages: [],
        },
      });
      console.log("User and team added to Firestore successfully");
    } catch (error) {
      console.error("Error adding user and team to Firestore:", error);
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
        teamId: team.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Detailed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

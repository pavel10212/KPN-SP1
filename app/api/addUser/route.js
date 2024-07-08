import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "../prismaClient";
import { hash } from "bcrypt";
import { registerSchema } from "@/lib/zod";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const sessionEmail = body.session.user.email;
    const role = body.role;
    const { email, password, name } = registerSchema.parse(body);

    const adminUser = await prisma.user.findUnique({
      where: { email: sessionEmail },
      include: { team: true },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const teamId = adminUser.teamId;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const chatEngineSecret = crypto.randomBytes(16).toString("hex");

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role,
        chatEnginePassword: chatEngineSecret,
        team: { connect: { id: teamId } },
      },
    });

    console.log("User created successfully");

    // Create user in Chat Engine
    const chatEngineData = {
      username: name.replace(/\s+/g, "_").toLowerCase(),
      first_name: name.split(" ")[0],
      last_name: name.split(" ").slice(1).join(" "),
      secret: chatEngineSecret,
    };

    const chatEnginePrivateKey =
      process.env.NEXT_PUBLIC_CHAT_ENGINE_PRIVATE_KEY;
    if (!chatEnginePrivateKey) {
      console.error("CHAT_ENGINE_PRIVATE_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      const chatEngineResponse = await fetch(
        "https://api.chatengine.io/users/",
        {
          method: "POST",
          headers: {
            "PRIVATE-KEY": chatEnginePrivateKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatEngineData),
        }
      );

      if (chatEngineResponse.ok) {
        console.log("Chat Engine user created successfully");

        // Add user to the team's chat
        if (adminUser.team.chatEngineId) {
          const addToChatResponse = await fetch(
            `https://api.chatengine.io/chats/${adminUser.team.chatEngineId}/people/`,
            {
              method: "POST",
              headers: {
                "Project-ID": process.env.NEXT_PUBLIC_CHAT_ENGINE_PROJECT_ID,
                "User-Name": adminUser.name.replace(/\s+/g, "_").toLowerCase(),
                "User-Secret": adminUser.chatEnginePassword,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username: chatEngineData.username }),
            }
          );

          if (addToChatResponse.ok) {
            console.log("User added to team chat successfully");
          } else {
            const errorText = await addToChatResponse.text();
            console.error("Failed to add user to team chat:", errorText);
          }
        } else {
          console.error("Team chat not found");
        }
      } else {
        const errorText = await chatEngineResponse.text();
        console.error("Failed to create Chat Engine user:", errorText);
      }
    } catch (error) {
      console.error("Error in Chat Engine operations:", error);
    }

    return NextResponse.json(
      { message: "User created and added to team chat successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Internal server error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

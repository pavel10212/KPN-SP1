import {z} from "zod";
import {NextResponse} from "next/server";
import prisma from "../prismaClient";
import {hash} from "bcrypt";
import {registerSchema} from "@/lib/zod";
import crypto from "crypto";

export async function POST(req) {
    console.log("POST request received");
    try {
        const body = await req.json();
        console.log("Request body:", JSON.stringify(body, null, 2));

        const sessionEmail = body.session?.user?.email;
        if (!sessionEmail) {
            console.error("Session email is missing");
            return NextResponse.json({error: "Session email is required"}, {status: 400});
        }

        const role = body.role;
        if (!role) {
            console.error("Role is missing");
            return NextResponse.json({error: "Role is required"}, {status: 400});
        }

        console.log("Parsing request body with registerSchema");
        const {email, password, name} = registerSchema.parse(body);

        console.log("Fetching admin user");
        const adminUser = await prisma.user.findUnique({
            where: {email: sessionEmail},
            include: {team: true},
        }).catch(error => {
            console.error("Error fetching admin user:", error);
            throw error;
        });

        if (!adminUser || adminUser.role !== "admin") {
            console.error("Unauthorized access attempt");
            return NextResponse.json({error: "Unauthorized"}, {status: 403});
        }

        const teamId = adminUser.teamId;
        if (!teamId) {
            console.error("Team ID is missing for admin user");
            return NextResponse.json({error: "Admin user's team not found"}, {status: 400});
        }

        console.log("Checking for existing user");
        const existingUser = await prisma.user.findUnique({where: {email}}).catch(error => {
            console.error("Error checking existing user:", error);
            throw error;
        });

        if (existingUser) {
            console.error("Email already exists:", email);
            return NextResponse.json({error: "Email already exists"}, {status: 400});
        }

        console.log("Hashing password");
        const hashedPassword = await hash(password, 10);
        const chatEngineSecret = crypto.randomBytes(16).toString("hex");

        console.log("Creating user in database");
        await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                role,
                chatEnginePassword: chatEngineSecret,
                team: {connect: {id: teamId}},
            },
        }).catch(error => {
            console.error("Error creating user in database:", error);
            throw error;
        });

        console.log("User created successfully in database");

        // Chat Engine operations
        const chatEnginePrivateKey = process.env.NEXT_PUBLIC_CHAT_ENGINE_PRIVATE_KEY;
        if (!chatEnginePrivateKey) {
            console.error("CHAT_ENGINE_PRIVATE_KEY is not set");
            return NextResponse.json({error: "Server configuration error"}, {status: 500});
        }

        const chatEngineData = {
            username: name.replace(/\s+/g, "_").toLowerCase(),
            first_name: name.split(" ")[0],
            last_name: name.split(" ").slice(1).join(" "),
            secret: chatEngineSecret,
        };

        console.log("Creating user in Chat Engine");
        try {
            const chatEngineResponse = await fetch("https://api.chatengine.io/users/", {
                method: "POST",
                headers: {
                    "PRIVATE-KEY": chatEnginePrivateKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(chatEngineData),
            });

            if (chatEngineResponse.ok) {
                console.log("Chat Engine user created successfully");

                if (adminUser.team.chatEngineId) {
                    console.log("Adding user to team chat");
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
                            body: JSON.stringify({username: chatEngineData.username}),
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

        console.log("User creation process completed");
        return NextResponse.json(
            {message: "User created and added to team chat successfully"},
            {status: 201}
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Zod validation error:", error.issues);
            return NextResponse.json({error: error.issues}, {status: 400});
        }
        console.error("Internal server error", error);
        return NextResponse.json({error: "Internal server error", details: error.message}, {status: 500});
    }
}
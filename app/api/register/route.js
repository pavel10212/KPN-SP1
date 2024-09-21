import {NextResponse} from "next/server";
import prisma from "../prismaClient";
import {hash} from "bcrypt";
import {z} from "zod";
import {registerSchema} from "@/lib/zod";
import crypto from "crypto";

export async function POST(req) {
    try {
        const body = await req.json();
        const {name, email, password} = registerSchema.parse(body);
        const {api_key, prop_key} = body;

        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return NextResponse.json(
                {error: "Email already exists"},
                {status: 400}
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
                });

                return {team, user};
            });

            team = result.team;
            user = result.user;
        } catch (error) {
            console.error("Error creating team or user:", error);
            return NextResponse.json(
                {error: "Failed to create team or user"},
                {status: 500}
            );
        }

        console.log("User and team created successfully");

        if (team && user) {
            const chatEngineData = {
                username: name.replace(/\s+/g, "_").toLowerCase(),
                first_name: name.split(" ")[0],
                last_name: name.split(" ").slice(1).join(" "),
                secret: chatEngineSecret,
            };

            try {
                const chatEngineResponse = await fetch(
                    "https://api.chatengine.io/users/",
                    {
                        method: "POST",
                        headers: {
                            "PRIVATE-KEY": process.env.NEXT_PUBLIC_CHAT_ENGINE_PRIVATE_KEY,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(chatEngineData),
                    }
                );

                if (chatEngineResponse.ok) {
                    const chatEngineResult = await chatEngineResponse.json();
                    console.log("Chat Engine user created:", chatEngineResult);

                    const chatEngineRoomResponse = await fetch(
                        "https://api.chatengine.io/chats/",
                        {
                            method: "POST",
                            headers: {
                                "Project-ID": process.env.NEXT_PUBLIC_CHAT_ENGINE_PROJECT_ID,
                                "User-Name": chatEngineData.username,
                                "User-Secret": chatEngineSecret,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                title: `${team.name}`,
                                is_direct_chat: false,
                            }),
                        }
                    );

                    if (chatEngineRoomResponse.ok) {
                        const roomResult = await chatEngineRoomResponse.json();
                        console.log("Chat Engine room created:", roomResult);

                        await prisma.team.update({
                            where: {id: team.id},
                            data: {chatEngineId: roomResult.id.toString()},
                        });
                    } else {
                        console.error("Failed to create Chat Engine room");
                        console.error(await chatEngineRoomResponse.text());
                    }
                } else {
                    console.error("Failed to create Chat Engine user");
                    console.error(await chatEngineResponse.text());
                }
            } catch (error) {
                console.error("Error in Chat Engine operations:", error);
            }
        }

        return NextResponse.json(
            {
                message: "User created successfully",
                userId: user.id
            },
            {status: 201}
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({error: error.issues}, {status: 400});
        }
        console.error("Detailed error:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}
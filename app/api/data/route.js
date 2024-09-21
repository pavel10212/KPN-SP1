import {NextResponse} from "next/server";
import prisma from "../prismaClient";

export async function POST(req) {
    try {
        const body = await req.json();

        const user = await prisma.user.findFirst({
            where: {
                id: body,
            },
        });

        console.log(user, "user");

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const teamId = user.teamId;

        console.log(teamId, "teamId");

        const team = await prisma.team.findFirst({
            where: {id: teamId},
        });

        if (!team) {
            return NextResponse.json({error: "Team not found"}, {status: 404});
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch("https://api.beds24.com/json/getBookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authentication: {
                        apiKey: team.api_key,
                        propKey: team.prop_key,
                    },
                    includeInvoice: false,
                    includeInfoItems: false,
                }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(response, "response")
            const data = await response.json();
            console.log(data, "data");
            return NextResponse.json(data);
        } finally {
            clearTimeout(timeoutId);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Request timed out after 30 seconds");
            return NextResponse.json({error: "Request timed out after 30 seconds"}, {status: 504});
        }
        console.error("Error processing request:", error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
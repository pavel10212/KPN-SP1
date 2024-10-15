import {NextResponse} from "next/server";
import prisma from "../prismaClient";
import {hash} from "bcrypt";
import {registerSchema} from "@/lib/zod";

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

        console.log("Creating user in database");
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                role,
                team: {connect: {id: teamId}},
            },
            include: {team: true},
        }).catch(error => {
            console.error("Error creating user in database:", error);
            throw error;
        });

        console.log("User creation process completed");
        return NextResponse.json(
            {
                message: "User created and added to team chat successfully",
                userId: newUser.id,
                teamId: teamId,
                teamName: newUser.team.name,
            },
            {status: 201}
        );
    } catch (error) {
        console.error("Error in user creation process:", error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}

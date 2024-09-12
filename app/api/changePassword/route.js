import prisma from "@/app/api/prismaClient";
import {auth} from "@/auth";
import {NextResponse} from "next/server";
import bcrypt from "bcrypt";


export async function POST(request) {
    try {
        const body = await request.json();
        const session = await auth();
        if (!session || !session.user) {
            console.log("Unauthorized: No valid session");
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const user = await prisma.user.findUnique({
            where: {id: session.user.id}
        });
        const userPassword = user.hashedPassword;


        try {
            bcrypt.compare(userPassword, body.currentPassword, function (err, result) {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return NextResponse.json({message: "Failed to change password", error: err.message}, {status: 500});
                    }
                    if (!result) {
                        return NextResponse.json({message: "Current password is incorrect"}, {status: 400});
                    }
                }
            );
            const hashedPassword = await bcrypt.hash(body.newPassword, 10);
            await prisma.user.update({
                where: {id: session.user.id},
                data: {hashedPassword}
            });
            console.log("Password changed successfully")
            return NextResponse.json({message: "Password changed successfully"}, {status: 200});
        } catch (e) {
            console.error("Error changing password:", e);
            return NextResponse.json({message: "Failed to change password", error: e.message}, {status: 500});
        }
    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json(
            {message: "Failed to change password", error: error.message},
            {status: 500}
        );
    }
}

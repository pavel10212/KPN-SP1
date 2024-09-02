import {NextResponse} from "next/server";
import prismaClient from "@/app/api/prismaClient";

export async function POST(req) {
    const { id } = await req.json();


    if (!id) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prismaClient.User.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted" });


}
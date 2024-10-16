import prisma from "../prismaClient";
import {NextResponse} from "next/server";


//Test
export async function GET() {
    const CompletedCustomTasks = await prisma.customTask.findMany({
        where: {
            status: {
                in: ["Completed", "Dropped Off"]
            },
        }
    });

    return NextResponse.json(CompletedCustomTasks);
}

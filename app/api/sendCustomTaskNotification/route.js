import {NextResponse} from "next/server";
import admin from "firebase-admin";
import {auth} from "@/auth";
import prismaClient from "@/app/api/prismaClient";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
    });
}


export async function POST(req) {
    try {
        const body = await req.json();
        const {taskTitle, taskDescription, role} = body.data;

        console.log("Body:", body);

        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        if (!body) {
            return NextResponse.json({error: "Title and body are required"}, {status: 400});
        }

        const userId = session.user.id;

        const user = await prismaClient.user.findUnique({
            where: {id: userId},
        });

        if (!user || !user.teamId) {
            return NextResponse.json({error: "User or team not found"}, {status: 404});
        }

        const teamId = user.teamId;

        const sendNotificationToRole = async (role) => {
            const topic = `team-${teamId}_${role}`;
            console.log("Sending notification to topic:", topic);

            const message = {
                notification: {
                    title: "", body: "",
                }, data: {
                    title: String(taskTitle), body: String(taskDescription),
                }, topic: topic
            };

            await admin.messaging().send(message);
        };
        try {
            console.log("Sending notification to role:", role);
            await sendNotificationToRole(role);
        } catch (error) {
            console.error("Error sending notification 1:", error);
            return NextResponse.json({error: "Failed to send notification 1"}, {status: 500});
        }

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({error: "Failed to send notification 2"}, {status: 500});
    }


}
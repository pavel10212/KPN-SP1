import {NextResponse} from 'next/server';
import admin from 'firebase-admin';
import { auth }  from '@/auth';
import prismaClient from "@/app/api/prismaClient";

if (!admin.apps.length) {
    const serviceAccount = require('@/public/service_key.json')
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
export async function POST(request) {
    try {
        const body = await request.json();
        const { sentTopic, sentTitle, sentMsg } = body;
        console.log('sentTopic:', sentTopic);
        console.log('sentTitle:', sentTitle);
        console.log('sentMsg:', sentMsg);

        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }

        if (!body) {
            return NextResponse.json({error: 'Title and body are required'}, {status: 400});
        }

        const userId = session.user.id;

        const user = await prismaClient.user.findUnique({
            where: {id: userId},
        });

        if (!user || !user.teamId) {
            return NextResponse.json({error: 'User or team not found'}, {status: 404});
        }

        const teamId = user.teamId;
        const roles = ['Maid', 'Co-Host'];

        const sendNotificationToRole = async (role) => {
            const topic = `team-${teamId}_${role}`;
            console.log('Sending notification to topic:', topic);
            console.log('Notification title:', sentTitle);
            console.log('Notification body:', body);

            const message = {
                notification: {
                    title: sentTitle,
                    body: sentMsg
                },
                topic: topic
            };

            await admin.messaging().send(message);
        };

        await Promise.all(roles.map(role => sendNotificationToRole(role)));

        return NextResponse.json({success: true});

    } catch (error) {
        console.error('Error in POST function:', error);
        return NextResponse.json({error: error.message || 'An error occurred'}, {status: 500});
    }
}
import {NextResponse} from 'next/server';
import admin from 'firebase-admin';


if (!admin.apps.length) {
    const serviceAccount = require('@/service_key.json')
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
export async function POST(request) {
    const {topic, title, body} = await request.json();

    if (!topic || !title || !body) {
        return NextResponse.json({error: 'Topic, title, and body are required'}, {status: 400});
    }
    try {
        const message = {
            notification: {
                title: title,
                body: body
            },
            topic: topic
        };
        try {
            await admin.messaging().send(message);
            return NextResponse.json({success: true});
        } catch (error) {
            return NextResponse.json({error: error}, {status: 500});
        }
    } catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }
}
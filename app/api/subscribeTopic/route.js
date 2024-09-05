import {NextResponse} from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
    });
}

export async function POST(request) {
    const {fcmToken, topic} = await request.json();

    if (!fcmToken || !topic) {
        return NextResponse.json({error: 'FCM token and topic are required'}, {status: 400});
    }

    console.log('Subscribing to topic:', topic);

    try {
        await admin.messaging().subscribeToTopic(fcmToken, topic);
        console.log('Successfully subscribed to topic:', topic);
        return NextResponse.json({message: 'Successfully subscribed to topic'}, {status: 200});
    } catch (error) {
        console.error('Error subscribing to topic:', error);
        return NextResponse.json({error: `Failed to subscribe to topic: ${error.message}`}, {status: 500});
    }
}
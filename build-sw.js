const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'firebase-messaging-sw.js.template.template'), 'utf8');

const result = template.replace(/NEXT_PUBLIC_FIREBASE_API_KEY/g, process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
    .replace(/NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN/g, process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
    .replace(/NEXT_PUBLIC_FIREBASE_PROJECT_ID/g, process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    .replace(/NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET/g, process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    .replace(/NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID/g, process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
    .replace(/NEXT_PUBLIC_FIREBASE_APP_ID/g, process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
    .replace(/NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID/g, process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);

fs.writeFileSync(path.join(__dirname, 'public', 'firebase-messaging-sw.js.template'), result, 'utf8');
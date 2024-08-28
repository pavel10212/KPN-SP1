import {getApp, getApps, initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
import {getMessaging, getToken, isSupported} from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDH-HoB3a61oXMt8raCm1uCpFp04Bxk-Ic",
    authDomain: "taskspro-200e3.firebaseapp.com",
    projectId: "taskspro-200e3",
    storageBucket: "taskspro-200e3.appspot.com",
    messagingSenderId: "476752964670",
    appId: "1:476752964670:web:0dfc4c596f2a255030b56f",
    measurementId: "G-GX9PS8J79Q"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const messaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
    try {
        const fcmMessaging = await messaging();
        if (fcmMessaging) {
            return await getToken(fcmMessaging, {
                vapidKey: 'BIaZo8Q4l1I7ad_a7zgl7nn44YfQBsABCkepaJNNvgCThpNuDnHz0uGwzbw59Xzm9aWHR1C27TSTZInKZFKcmz8'
            });
        }
        return null;
    } catch (err) {
        console.error('Error fetching FCM token:', err);
        return null;
    }
}

export {storage, app, messaging};

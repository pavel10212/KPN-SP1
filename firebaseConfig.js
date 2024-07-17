import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDH-HoB3a61oXMt8raCm1uCpFp04Bxk-Ic",
  authDomain: "taskspro-200e3.firebaseapp.com",
  projectId: "taskspro-200e3",
  storageBucket: "taskspro-200e3.appspot.com",
  messagingSenderId: "476752964670",
  appId: "1:476752964670:web:e70574014597f7aa30b56f",
  measurementId: "G-R6DH6TVRS6",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY",
    });
    if (currentToken) {
      console.log("current token for client: ", currentToken);
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });

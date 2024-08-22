import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDH-HoB3a61oXMt8raCm1uCpFp04Bxk-Ic",
  authDomain: "taskspro-200e3.firebaseapp.com",
  projectId: "taskspro-200e3",
  storageBucket: "taskspro-200e3.appspot.com",
  messagingSenderId: "476752964670",
  appId: "1:476752964670:web:0dfc4c596f2a255030b56f",
  measurementId: "G-GX9PS8J79Q"
};


const app = initializeApp(firebaseConfig)
const storage = getStorage(app);

export { storage }
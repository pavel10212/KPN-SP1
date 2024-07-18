importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDH-HoB3a61oXMt8raCm1uCpFp04Bxk-Ic",
  authDomain: "taskspro-200e3.firebaseapp.com",
  projectId: "taskspro-200e3",
  storageBucket: "taskspro-200e3.appspot.com",
  messagingSenderId: "476752964670",
  appId: "1:476752964670:web:e70574014597f7aa30b56f",
});

const messaging = firebase.messaging();


messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

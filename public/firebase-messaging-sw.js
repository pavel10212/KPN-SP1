importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

const firebaseConfig = {
    apiKey: "AIzaSyDH-HoB3a61oXMt8raCm1uCpFp04Bxk-Ic",
    authDomain: "taskspro-200e3.firebaseapp.com",
    projectId: "taskspro-200e3",
    storageBucket: "taskspro-200e3.appspot.com",
    messagingSenderId: "476752964670",
    appId: "1:476752964670:web:0dfc4c596f2a255030b56f",
    measurementId: "G-GX9PS8J79Q"

};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);


    const link = payload.fcmOptions?.link || payload.data?.link;
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "./logo.jpg",
        data: {url: link},
    }
    self.registration.showNotification(notificationTitle, notificationOptions);
})

self.addEventListener("notificationclick", function (event) {
    console.log("[firebase-messaging-sw.js] Notification click Received.", event.notification.data.url);
    event.notification.close();
    event.waitUntil(
        clients
            .matchAll({type: "window", includeUncontrolled: true})
            .then(function (clientList) {
                const url = event.notification.data.url;

                if (!url) return;

                for (const client of clientList) {
                    if (client.url === url && "focus" in client) {
                        return client.focus();
                    }
                }

                if (clients.openWindow) {
                    console.log("Openwindow on client")
                    return clients.openWindow(url);
                }
            })
    )
})
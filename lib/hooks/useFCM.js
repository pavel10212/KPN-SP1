import {useEffect, useRef, useState} from 'react';
import {onMessage} from "firebase/messaging";
import {fetchToken, messaging} from "@/lib/firebase/firebaseConfig";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export const useFCM = (fcmEnabled) => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const retryLoadToken = useRef(0);
    const isLoading = useRef(false);
    const [messages, setMessages] = useState(null);

    const loadToken = async () => {
        if (isLoading.current) return;

        isLoading.current = true;
        try {
            const currentToken = await fetchToken();

            if (currentToken) {
                setToken(currentToken);
                console.log('FCM token:', currentToken);
            } else {
                console.log('No registration token available.');
                if (retryLoadToken.current < 3) {
                    retryLoadToken.current += 1;
                    console.error("An error occurred while retrieving token. Retrying...");
                    await loadToken();
                } else {
                    console.error("Unable to load token after 3 retries");
                }
            }
        } catch (error) {
            console.error('Error retrieving FCM token:', error);
        } finally {
            isLoading.current = false;
        }
    };

    useEffect(() => {
        if (fcmEnabled) {
            loadToken();
        }
    }, [fcmEnabled]);

    useEffect(() => {
        const setupListener = async () => {
            if (!fcmEnabled || !token) return;

            console.log(`onMessage registered with token ${token}`);
            const m = await messaging();
            if (!m) return;

            return onMessage(m, (payload) => {
                console.log("Foreground push notification received:", payload);
                const link = payload.fcmOptions?.link || payload.data?.link;

                if (link) {
                    toast.info(
                        `${payload.notification?.title}: ${payload.notification?.body}`,
                        {
                            action: {
                                label: "Visit",
                                onClick: () => {
                                    router.push(link);
                                },
                            },
                        }
                    );
                } else {
                    toast.info(
                        `${payload.notification?.title}: ${payload.notification?.body}`
                    );
                }

                setMessages(payload);
            });
        };

        let unsubscribe;
        setupListener().then((unsub) => {
            unsubscribe = unsub;
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [fcmEnabled, token, router]);

    return {fcmToken: token, messages};
};
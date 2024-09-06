import { useEffect, useRef, useState } from 'react';
import { fetchToken } from "@/lib/firebase/firebaseConfig";

export const useFCM = (fcmEnabled) => {
    const [token, setToken] = useState(null);
    const retryLoadToken = useRef(0);
    const isLoading = useRef(false);
    const [isTokenLoading, setIsTokenLoading] = useState(false);

    const loadToken = async () => {
        if (isLoading.current) return;
        isLoading.current = true;
        setIsTokenLoading(true);
        try {
            const storedToken = localStorage.getItem("fcmToken");
            if (storedToken) {
                setToken(storedToken);
                console.log('FCM token:', storedToken);
                return;
            }
            const currentToken = await fetchToken();
            console.log(currentToken)

            if (currentToken) {
                setToken(currentToken);
                console.log('FCM token:', currentToken);
                localStorage.setItem("fcmToken", currentToken);
            } else {
                console.log('No registration token available. Retrying...');
                if (retryLoadToken.current < 5) {
                    retryLoadToken.current += 1;
                    setTimeout(() => loadToken(), 1000);
                } else {
                    console.error("Unable to load token after 5 retries");
                }
            }
        } catch (error) {
            console.error('Error retrieving FCM token:', error);
            if (retryLoadToken.current < 5) {
                retryLoadToken.current += 1;
                setTimeout(() => loadToken(), 1000);
            } else {
                console.error("Unable to load token after 5 retries");
            }
        } finally {
            isLoading.current = false;
            setIsTokenLoading(false);
        }
    };

    useEffect(() => {
        if (fcmEnabled && !token) {
            loadToken();
        }
    }, [fcmEnabled, token]);

    return { fcmToken: token, isTokenLoading };
}
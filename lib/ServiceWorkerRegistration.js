"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFCM } from "@/lib/hooks/useFCM";
import { messaging } from "@/lib/firebase/firebaseConfig";
import { toast, Toaster } from "sonner";
import { onMessage } from "firebase/messaging";

const ClientFCMHandler = () => {
  const router = useRouter();
  const { fcmToken, isTokenLoading } = useFCM(true);
  const listenerRegistered = useRef(false);

  useEffect(() => {
    const setupMessageListener = async () => {
      if (!fcmToken || isTokenLoading || listenerRegistered.current) return;

      console.log(`onMessage registered with token ${fcmToken}`);
      const m = await messaging();
      if (!m) return;

      onMessage(m, (payload) => {
        console.log("Foreground push notification received:", payload);
        const link = payload.fcmOptions?.link || payload.data?.link;

        if (link) {
          console.log("Link found in notification payload:", link);
          toast.info(
            `${payload.data?.title}: ${payload.data?.body}`,
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
            `${payload.data?.title}: ${payload.data?.body}`
          );
        }
      });

      listenerRegistered.current = true;
    };

    setupMessageListener();
  }, [fcmToken, isTokenLoading, router]);

  return <Toaster />;
};

export default ClientFCMHandler;
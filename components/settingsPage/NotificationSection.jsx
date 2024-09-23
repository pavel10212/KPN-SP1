"use client";

import { useState, useCallback, useEffect } from "react";
import { useFCM } from "@/lib/hooks/useFCM";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const NotificationsSection = ({ setError }) => {
  const [fcmEnabled, setFcmEnabled] = useState(false);
  const { fcmToken, messages, isTokenLoading } = useFCM(fcmEnabled);
  const [notifications, setNotifications] = useState({ fcm: false });
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] =
    useState(false);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setIsNotificationPermissionGranted(true);
          return true;
        } else {
          toast.error(
            "Notification permission denied. Please enable notifications in your browser settings."
          );
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        toast.error("Failed to request notification permission.");
      }
    }
    return false;
  }, []);

  useEffect(() => {
    if (fcmEnabled && messages) {
      console.log("Received message:", messages);
      toast.success(messages.data.title, {
        description: messages.data.body,
      });
    }
  }, [fcmEnabled, messages]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js", { type: "module" })
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const handleNotificationChange = useCallback(
    async (checked) => {
      if (checked) {
        if (!isNotificationPermissionGranted) {
          const permissionGranted = await requestNotificationPermission();
          if (permissionGranted) {
            setFcmEnabled(true);
            setNotifications((prev) => ({
              ...prev,
              fcm: true,
            }));
          } else {
            toast.error(
              "Notification permission denied. Please enable notifications in your browser settings."
            );
            setNotifications((prev) => ({
              ...prev,
              fcm: false,
            }));
          }
        } else {
          setFcmEnabled(true);
          setNotifications((prev) => ({
            ...prev,
            fcm: true,
          }));
        }
      } else {
        setFcmEnabled(false);
        setNotifications((prev) => ({
          ...prev,
          fcm: false,
        }));
      }
    },
    [isNotificationPermissionGranted, requestNotificationPermission]
  );

  const saveNotificationPreferences = async () => {
    setIsNotificationLoading(true);
    try {
      const response = await fetch("/api/saveNotificationPreferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fcm: notifications.fcm,
          fcmToken: notifications.fcm ? fcmToken : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notification preferences");
      }

      const result = await response.json();

      if (result.fcmEnabled && fcmToken) {
        const topic =
          result.user.role === "admin"
            ? `team-${result.user.teamId}_admin`
            : `team-${result.user.teamId}_${result.user.role}`;

        const subscribeResponse = await fetch("/api/subscribeTopic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fcmToken, topic }),
        });

        if (!subscribeResponse.ok) {
          throw new Error("Failed to subscribe to topic");
        }

        console.log(`Subscribed to topic: ${topic}`);
      }

      toast.success("Notification preferences saved successfully");
    } catch (error) {
      setError("Failed to save notification preferences");
      console.error(error);
    } finally {
      setIsNotificationLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="fcm-notifications">Firebase Push Notifications</Label>
          <Switch
            id="fcm-notifications"
            checked={notifications.fcm}
            onCheckedChange={handleNotificationChange}
            aria-label="Firebase Push Notifications"
          />
        </div>
        {isNotificationPermissionGranted && (
          <p className="text-sm text-green-500">
            Notification access has already been granted.
          </p>
        )}
        {!isNotificationPermissionGranted && notifications.fcm && (
          <p className="text-sm text-red-500">
            Notification permission is required. Please enable notifications in
            your browser settings.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={saveNotificationPreferences}
          disabled={isNotificationLoading || isTokenLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
        >
          {isNotificationLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsSection;

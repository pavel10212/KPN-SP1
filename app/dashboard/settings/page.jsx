"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ProfileSection from "@/components/settingsPage/ProfileSection";
import SecuritySection from "@/components/settingsPage/SecuritySection";
import NotificationsSection from "@/components/settingsPage/NotificationSection";
import { LoadingWrapper } from "@/components/loading/loadingWrapper";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState("");
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setError("");
  }, [activeTab]);

  if (status === "loading") {
    return <LoadingWrapper />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md">
        <Tabs defaultValue="profile" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSection setError={setError} />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySection setError={setError} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsSection setError={setError} />
          </TabsContent>
        </Tabs>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

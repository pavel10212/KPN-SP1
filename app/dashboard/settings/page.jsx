"use client";


import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFCM } from "@/lib/hooks/useFCM";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    image: z
        .any()
        .refine(
            (files) => !files || files?.length == 0 || files?.[0]?.size <= MAX_FILE_SIZE,
            `Max file size is 5MB.`
        )
        .refine(
            (files) =>
                !files ||
                files?.length == 0 ||
                ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        )
        .optional(),
});

const securitySchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters"),
        confirmPassword: z
            .string()
            .min(8, "Confirm password must be at least 8 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

const SettingsPage = () => {
    const [fcmEnabled, setFcmEnabled] = useState(false);
    const { fcmToken, messages, isTokenLoading } = useFCM(fcmEnabled);
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState({
        fcm: false,
    });
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isSecurityLoading, setIsSecurityLoading] = useState(false);
    const [isNotificationLoading, setIsNotificationLoading] = useState(false);
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [isNotificationPermissionGranted, setIsNotificationPermissionGranted] = useState(false);

    const checkNotificationPermission = useCallback(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                setIsNotificationPermissionGranted(true);
                return true;
            }
        }
        setIsNotificationPermissionGranted(false);
        return false;
    }, []);

    const requestNotificationPermission = useCallback(async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setIsNotificationPermissionGranted(true);
                    return true;
                } else {
                    toast.error("Notification permission denied. Please enable notifications in your browser settings.");
                }
            } catch (error) {
                console.error("Error requesting notification permission:", error);
                toast.error("Failed to request notification permission.");
            }
        }
        return false;
    }, []);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        setError("");
    }, [activeTab]);

    useEffect(() => {
        if (fcmEnabled && messages) {
            console.log('Received message:', messages);
            toast.success(messages.data.title, {
                description: messages.data.body,
            });
        }
    }, [fcmEnabled, messages]);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js', {type: 'module'})
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            image: undefined,
        },
    });

    const securityForm = useForm({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onProfileSubmit = async (data) => {
        setIsProfileLoading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]);
            }

            const response = await fetch("/api/updateProfile", {
                method: "POST",
                body: formData,
            });

            const responseText = await response.text();
            console.log("Raw response:", responseText);

            if (!response.ok) {
                if (responseText.trim().startsWith('<')) {
                    console.error("Received HTML instead of JSON:", responseText);
                    throw new Error("Received HTML response instead of JSON");
                }
                try {
                    const errorData = JSON.parse(responseText);
                    throw new Error(errorData.message || "Failed to update profile");
                } catch (parseError) {
                    console.error("Error parsing JSON:", parseError);
                    throw new Error("Failed to update profile. Invalid server response.");
                }
            }

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                throw new Error("Failed to parse server response as JSON");
            }

            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: result.name,
                    email: result.email,
                    image: result.image,
                },
            });

            toast.success("Profile updated successfully");
            router.refresh();
            setPreviewImage(null);
            profileForm.reset(result);
        } catch (error) {
            setError(error.message || "Failed to update profile. Please try again.");
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError("File size exceeds 5MB limit.");
                return;
            }
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                setError("File type not accepted. Please use .jpg, .jpeg, .png or .webp.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const onSecuritySubmit = async (data) => {
        setIsSecurityLoading(true);
        setError("");
        try {
            const response = await fetch("/api/changePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to change password");
            }

            toast.success("Password changed successfully");
            securityForm.reset();
        } catch (error) {
            setError(error.message || "Failed to change password. Please try again.");
        } finally {
            setIsSecurityLoading(false);
        }
    };

    const handleNotificationChange = useCallback(async (checked) => {
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
                    toast.error("Notification permission denied. Please enable notifications in your browser settings.");
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
    }, [isNotificationPermissionGranted, requestNotificationPermission]);

    const saveNotificationPreferences = async () => {
        setIsNotificationLoading(true);
        try {
            const response = await fetch("/api/saveNotificationPreferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fcm: notifications.fcm,
                    fcmToken: notifications.fcm ? fcmToken : null
                }),
            });
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to save notification preferences");
            }

            const result = await response.json();
            console.log(result);

            if (result.fcmEnabled && fcmToken) {
                const topic = result.user.role === "admin"
                    ? `team-${result.user.teamId}_admin`
                    : `team-${result.user.teamId}_${result.user.role}`;

                const subscribeResponse = await fetch('/api/subscribeTopic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fcmToken, topic }),
                });

                if (!subscribeResponse.ok) {
                    throw new Error('Failed to subscribe to topic');
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

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <Tabs defaultValue="profile" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your profile details here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form
                                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={profileForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} aria-label="Name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} aria-label="Email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Profile Picture</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            field.onChange(e.target.files);
                                                            handleImageChange(e);
                                                        }}
                                                        aria-label="Profile Picture"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {previewImage && (
                                        <div className="mt-4">
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                width={100}
                                                height={100}
                                                className="rounded-full"
                                            />
                                        </div>
                                    )}
                                    <Button type="submit" disabled={isProfileLoading}>
                                        {isProfileLoading ? "Updating..." : "Update Profile"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Ensure your account is using a long, random password to stay
                                secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...securityForm}>
                                <form
                                    onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={securityForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} aria-label="Current Password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={securityForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} aria-label="New Password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={securityForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field}
                                                        aria-label="Confirm New Password" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isSecurityLoading}>
                                        {isSecurityLoading ? "Changing..." : "Change Password"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Manage how you receive notifications.
                            </CardDescription>
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
                                    Notification permission is required. Please enable notifications in your browser
                                    settings.
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={saveNotificationPreferences}
                                disabled={isNotificationLoading || isTokenLoading}
                            >
                                {isNotificationLoading ? "Saving..." : "Save Preferences"}
                            </Button>
                        </CardFooter>
                    </Card>
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
    );
};

export default SettingsPage;
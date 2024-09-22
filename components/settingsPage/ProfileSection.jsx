"use client";

import {useState, useCallback} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {toast} from "sonner";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    image: z
        .any()
        .refine(
            (files) => !files || files?.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
            `Max file size is 5MB.`
        )
        .refine(
            (files) => !files || files?.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        )
        .optional(),
});

const ProfileSection = ({setError}) => {
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const {data: session, update} = useSession();
    const router = useRouter();

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            image: undefined,
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

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const result = await response.json();

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
    }, [setError]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                            control={profileForm.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} aria-label="Name"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} aria-label="Email"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="image"
                            render={({field}) => (
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
                                    <FormMessage/>
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
                        <Button
                            type="submit"
                            disabled={isProfileLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        >
                            {isProfileLoading ? "Updating..." : "Update Profile"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ProfileSection;
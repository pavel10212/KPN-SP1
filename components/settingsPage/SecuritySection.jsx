"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {toast} from "sonner";

const securitySchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const SecuritySection = ({setError}) => {
    const [isSecurityLoading, setIsSecurityLoading] = useState(false);

    const securityForm = useForm({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSecuritySubmit = async (data) => {
        setIsSecurityLoading(true);
        setError("");
        try {
            const response = await fetch("/api/changePassword", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4 max-w-md">
                        {["currentPassword", "newPassword", "confirmPassword"].map((name, index) => (
                            <FormField key={index} control={securityForm.control} name={name} render={({field}) => (
                                <FormItem>
                                    <FormLabel>{name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</FormLabel>
                                    <Input type="password" {...field} aria-label={name}/>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        ))}
                        <Button type="submit" disabled={isSecurityLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                            {isSecurityLoading ? "Changing..." : "Change Password"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SecuritySection;
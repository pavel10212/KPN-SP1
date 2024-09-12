import {object, string, enum as zodEnum} from "zod";

export const registerSchema = object({
    name: string().min(2, "Name must be at least 2 characters"),
    email: string().email("Invalid email address"),
    password: string().min(3, "Password must be at least 3 characters"), //Change to 8 after testing
    role: zodEnum(["Co-Host", "Maid", "Maintenance", "Driver"], {
        errorMap: () => ({message: "Please select a valid role"})
    }),
});

export const signInSchema = object({
    email: string({required_error: "Email is required"})
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({required_error: "Password is required"})
        .min(1, "Password is required")
        .min(3, "Password must be more than 3 characters") //CHANGE TO 8 AFTER TESTING
        .max(32, "Password must be less than 32 characters"),
});
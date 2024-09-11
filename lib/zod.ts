import {object, string} from "zod";

export const registerSchema = object({
  name: string().min(2),
  email: string().email(),
  password: string().min(3), //Change to 8 after testing
});

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(3, "Password must be more than 8 characters") //CHANGE TO 8 AFTER TESTING
    .max(32, "Password must be less than 32 characters"),
});

import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().max(100, "Name is too long").optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type SigninInput = z.infer<typeof signinSchema>;

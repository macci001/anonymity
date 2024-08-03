import {z} from "zod";

export const userValidation = z.string()
    .min(2, "Username should have atleast 2 characters")
    .max(20, "Username should be no more than 20 characters")
    .regex(/^[0-9A-Za-z_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
    username: userValidation,
    email: z.string().email({message: "Email should be valid"}),
    password: z.string().min(6, {message: "Password should have minimum 6 characters."})
})
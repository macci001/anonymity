import {z} from "zod";

export const messageSchema = z.object({
    content: z.string()
        .min(10, {message: "Content must of atleast 10 characters"})
        .max(150, {message: "Content cannot be more than 50 characters."})
})
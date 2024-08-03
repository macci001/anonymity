import {boolean, z} from "zod";

export const acceptingMessageSchema = z.object({
    isAcceptingMessages: z.boolean()
})
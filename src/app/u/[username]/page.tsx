"use client"

import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const MessagePage = () => {
    const {username} = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast();

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    })

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post<ApiResponse>(
                "/api/send-message",
                {
                    username,
                    content: data.content
                }
            )
            toast({
                title: "Success!!!",
                description: `Your message is successfully send to the ${username}`
            })
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message ?? "Something went wrong";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            form.setValue("content", "");
            setIsSubmitting(false);
        }
    }

    return (<div className="flex flex-col gap-y-16">
        <div className="p-8 flex flex-col gap-y-28 items-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="content"
                    disabled={isSubmitting}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Type the message which would like to send..." {...field} className="w-[90vw] h-[20vh]"/>  
                        </FormControl>
                        <FormDescription>
                            Don&apos;t worry, with SecretFeedback your messages are secret.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>Submit</Button>
                </form>
            </Form>
            <div className="flex flex-col items-center">
                <div className="text-sm md:text-lg">Join <span className="font-bold">SecretFeeback</span> today</div>
                <div className="text-xs md:text-sm text-muted-foreground text-center">Feedback is truthful only when it is kept secret!!</div>
                <Button className="text-sm md:text-lg p-2 md:p-4 mt-2 md:mt-4">
                    <Link href="/sign-in">
                        Create Account today
                    </Link>
                </Button>
            </div>
        </div>
    </div>
    )
};
export default MessagePage;
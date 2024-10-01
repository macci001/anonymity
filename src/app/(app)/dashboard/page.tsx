"use client"

import { Button } from "@/components/ui/button";
import { MessageCard } from "@/components/ui/message-card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useWindow } from "@/hooks/use-window";
import { Message, User } from "@/model/user";
import { acceptingMessageSchema } from "@/schemas/acceptingMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const DashboardPage = () => {
    const {toast} = useToast();
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const {data: session} = useSession();
    const username = session?.user.username;  

    const window = useWindow();

    const baseUrl = `${window?.location.protocol}//${window?.location.hostname}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: "Copied",
            description: "Link successfully copied to the clipboard"
        })
    }

    const form = useForm<z.infer<typeof acceptingMessageSchema>>({
        resolver: zodResolver(acceptingMessageSchema)
    })
    const {register, watch, setValue} = form;
    const isAcceptingMessages = watch("isAcceptingMessages");

    const handleSwitchChange = async () => {
        try {
            setIsSwitchLoading(true);
            const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
                acceptMessage: !isAcceptingMessages
            })
            setValue("isAcceptingMessages", !isAcceptingMessages);
            toast({
                title: "Status Changed",
                description: `${isAcceptingMessages ? "not " : ""}accepting the mesagges`
            })
        } catch (e) {
            const error = e as AxiosError<ApiResponse>;
            toast({
                title: "Failed to change the status",
                description: error.response?.data.message ?? "Some error occurred",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoading(false);
        }
    }

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        try {
            setIsLoading(true);
            const response = await axios.get<ApiResponse>(`/api/get-messages`);
            setMessages(response.data.messages || []);
            if(refresh) {
                toast({
                    title: "Messages refreshed!!!",
                    description: "Showing the latest messages"
                })
            }
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            setMessages([]);
            toast({
                title: "No Messages found.",
                description: axiosError.response?.data.message ?? "Something went wrong"
            })
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setMessages, toast])

    const fetchIsAcceptingMessage = useCallback(async () => {
        try {
            setIsLoading(true);
            setIsSwitchLoading(true);
            const response = await axios.get<ApiResponse>(`/api/accept-messages`);
            setValue("isAcceptingMessages", response.data.isAcceptingMessages || false);
        } catch (e) {
            const axiosError = e as AxiosError<ApiResponse>;
            toast({
                title: "Error in accepting status",
                description: axiosError.response?.data.message ?? "Something went wrong",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    }, [setIsLoading, setValue, toast])

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    useEffect(() => {
        if (!session || !session.user) return;
    
        fetchMessages();
        fetchIsAcceptingMessage();
    }, [session, setValue, toast, fetchIsAcceptingMessage, fetchMessages]);

    

    return (<div className="my-8 lg:mx-auto p-6 rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">{username}&apos;s Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4 flex items-center">
            <Switch 
               checked={isAcceptingMessages}
               onCheckedChange={handleSwitchChange}
               disabled={isSwitchLoading}
               {...register('isAcceptingMessages')} />
            <span className="ml-2">
                    Accept Messages: {isAcceptingMessages ? 'On' : 'Off'}
            </span>
        </div>

        <Separator />

        <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message: Message) => (
                <MessageCard
                  key={message.content + message.createdAt}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
    </div>
    )
}
export default DashboardPage;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
import { Button} from "./button";
import { Message } from "@/model/user";
import { useToast } from "./use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { X } from "lucide-react";

interface MessageCardProps {
    message: Message,
    fetchMessages: (refresh: boolean) => void
}

export const MessageCard = ({
    message,
    fetchMessages
} : MessageCardProps) => {
    const {toast} = useToast();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/message-delete/${message._id}`
            );
            toast({
                title: "Deleted...",
                description: "Message deleted successfully"
            })
            fetchMessages(true);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? "Failed to delete the message",
                variant: "destructive"
            }) 
        }
    }

    return (
        <Card className="card-bordered relative">
          <CardHeader>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="absolute top-0 right-0" variant={"ghost"}>
                    <X className="h-3 w-3"/>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent className="text-sm">
            {message.content}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
    )
};
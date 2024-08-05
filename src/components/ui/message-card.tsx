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
    onMessageDelete: (messageId: string) => void
}

export const MessageCard = ({
    message,
    onMessageDelete
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
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="absolute top-2 right-2">
                    <X className="h-4 w-4"/>
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
          <CardContent>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
    )
};
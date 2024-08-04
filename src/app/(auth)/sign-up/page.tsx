"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import * as z from "zod";
import {useDebounceCallback} from "usehooks-ts";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');
  const {toast} = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
        setIsSubmitting(true);
        const response = await axios.post<ApiResponse>(`/api/sign-up`, {
            username: data.username,
            email: data.email,
            password: data.password
        })
        console.log(response.data.message);
        toast({
            title: "Success",
            description: response.data.message
        })
        router.replace(`/verify/${username}`);
    } catch(e) {
      const axiosError = e as AxiosError<ApiResponse>;
        toast({
            title: "Signup failed",
            description: axiosError.response?.data.message ?? "Some error occured in sign-up",
            variant: "destructive"
        })
    } finally {
        setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const checkUsername = async () => {
      if(username.length == 0){
        setUsernameMessage('');
        return;
      }
      try {
        setUsernameChecking(true);
        setUsernameMessage('');
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        setUsernameMessage(response.data.message);
      } catch (e) {
        setUsernameMessage('Error in getting the username');
      } finally {
        setUsernameChecking(false);
      } 
    }
    checkUsername();
  }, [username]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if(!mounted) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymity
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} onChange={(e) => {field.onChange(e); debounced(e.target.value)}} />
                    </FormControl>
                    <FormDescription>
                      {
                        usernameChecking ? <span className="text-sm text-muted-foreground">
                          Checking username
                        </span> : <span>
                          {usernameMessage}
                        </span>
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field}/>
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>Submit</Button>
            </form>
        </Form>
      </div>
    </div>
  )
}
export default SignInPage;
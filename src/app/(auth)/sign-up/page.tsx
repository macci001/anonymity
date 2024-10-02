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
import Link from "next/link";

const SignUpPage = () => {
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
            username: data.username.toLowerCase(),
            email: data.email,
            password: data.password
        })
        console.log(response.data.message);
        toast({
            title: "Success",
            description: response.data.message
        })
        router.replace(`/verify/${username.toLowerCase()}`);
    } catch(e) {
      const axiosError = e as AxiosError<ApiResponse>;
      console.log(axiosError.response?.data);
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
        const response = await axios.get(`/api/check-username-unique?username=${username.toLowerCase()}`);
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md shadow-foreground/10 border border-2-foreground">
        <div className="text-center">
          <span className="text-xl tracking-tight mb-6">
            Join the <span className="font-bold">SecretFeedback</span> tribe!
          </span>
          <div className="text-sm text-muted-foreground font-light">
            Please enter the details below to sign-up.
          </div>
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
        <div className="text-sm text-muted-foreground">
          Already have an account <Link href="/sign-in" className="underline text-blue-700">
            sign-in
          </Link>
        </div>
      </div>
    </div>
  )
}
export default SignUpPage;
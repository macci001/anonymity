"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import * as z from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignInPage = () => {
  const {toast} = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    setIsSubmitting(false);
    if(response?.error) {
      toast({
        description: response.error,
        variant: "destructive"
      })
      return;
    }
    console.log(response);
    if(response?.url){
      router.push("/dashboard");
    }
  }

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
            sign-in Anonymity
          </h1>
          <p className="mb-4">Signin for anonymous adventure</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input placeholder="username/email" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} type="password"/>
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
          Do not have an account <Link href="/sign-up" className="underline text-blue-700">
            sign-up
          </Link>
        </div>
      </div>
    </div>
  )
}
export default SignInPage;
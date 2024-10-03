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
import { Github } from "lucide-react";

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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-4 rounded-lg shadow-md shadow-foreground/10 border border-2-foreground">
        <div className="text-center">
          <span className="text-xl tracking-tight mb-6">
            Welcome back to <span className="font-bold">SecretFeedback</span>
          </span>
          <div className="text-sm text-muted-foreground font-light">
            Please enter your credentials to sign-in.
          </div>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
              <Button type="submit" disabled={isSubmitting} className="w-full">Submit</Button>
            </form>
        </Form>
        <Button className="w-full" onClick={async () => {
          await signIn("github", {redirect: false});
        }}>
          <div className="flex items-center">
            Continue with Github <Github className="w-4 h-4 ml-2"/>
          </div>
        </Button>
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
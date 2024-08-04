"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import {useDebounceValue} from "usehooks-ts";
import { useEffect, useState } from "react";
import axios from "axios";
import { signUpSchema } from "@/schemas/signUpSchema";

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');

  const [debouncedUsername] = useDebounceValue(username, 500);
  
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

  }

  useEffect(() => {
    const checkUsername = async () => {
      try {
        setUsernameChecking(true);
        setUsernameMessage('');
        const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
        setUsernameMessage(response.data.message);
      } catch (e) {
        setUsernameMessage('Error in getting the username');
      } finally {
        setUsernameChecking(false);
      } 
    }
    checkUsername();
  }, [debouncedUsername]);
  return (
    <div>

    </div>
  )
}
export default SignInPage;
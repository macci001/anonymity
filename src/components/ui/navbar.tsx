"use client"

import { User } from "@/model/user";
import { LogIn, LogOut, MoonIcon, SunIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./button";
import { useTheme } from "next-themes";

const Navbar = () => {
    const {data: session} = useSession();
    const user: User = session?.user as User; 
    const {setTheme, theme} = useTheme();
    return (
        <div className="flex p-4 items-center justify-between border-b">
            <div className="flex items-center gap-x-2">
                <img src="./logo.png" className="h-8 w-8"></img>
                <div className="text-xl font-semibold hidden md:block">
                    SecretFeedback
                </div>
            </div>
            <div className="flex">
                <div className="px-4 flex items-center gap-x-2">
                    <Button onClick={() => {theme && theme === "dark" ? setTheme("light") : setTheme("dark")}} className="rounded-full">
                        {
                            theme && theme === "dark" ? <>
                                <SunIcon className="w-4 h-4" />
                            </> : <>
                                <MoonIcon className="w-4 h-4"/>
                            </>
                        }
                    </Button>
                    {
                        session ? <button className="p-3 rounded-md border hover:bg-muted-foreground" onClick={() => signOut()}>
                            <div className="flex items-center gap-x-2">
                                <span className="font-medium text-sm hidden md:block">
                                    SignOut</span>
                                <LogOut className="h-4 w-4"/> 
                            </div>
                        </button> : <button className="p-3 rounded-md border hover:bg-foreground/20">
                            <Link href={"/sign-in"}>
                                <div className="flex items-center gap-x-2">
                                    <span className="font-medium text-sm hidden md:block">
                                        SignIn
                                    </span>
                                    <LogIn className="h-4 w-4" /> 
                                </div>
                            </Link>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}
export default Navbar;
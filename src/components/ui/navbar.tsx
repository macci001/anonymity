"use client"

import { User } from "@/model/user";
import { LogIn, LogOut, MoonIcon, SunIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./button";
import { useTheme } from "next-themes";
import { Switch } from "./switch";
import { useState } from "react";

const Navbar = () => {
    const {data: session} = useSession();
    const user: User = session?.user as User; 
    const {setTheme, theme} = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(theme === "dark");
    return (
        <div className="fixed top-0 w-full backdrop-blur-md bg-background/30 flex p-4 items-center justify-between border-b h-16 z-10">
            <Link href={"/"}>
                <div className="flex items-center gap-x-2">
                    <img src="./logo.png" className="h-8 w-8"></img>
                    <div className="text-xl font-semibold hidden md:block">
                        SecretFeedback
                    </div>
                </div>
            </Link>
            <div className="flex">
                <div className="px-4 flex items-center gap-x-2">
                    <Switch
                        checked={isDarkMode}
                        onCheckedChange={(checked) => {checked ? setTheme("dark") : setTheme("light"); setIsDarkMode(!isDarkMode)}}
                        >
                    </Switch>
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
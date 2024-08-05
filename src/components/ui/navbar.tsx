"use client"

import { User } from "@/model/user";
import { LogIn, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
    const {data: session} = useSession();
    const user: User = session?.user as User; 
    return (
        <div className="flex p-4 items-center justify-between border-b">
            <div className="text-xl font-semibold">
                Anonymity
            </div>
            <div className="flex">
                <div className="px-4">
                    {
                        session ? <button className="p-3 rounded-md border hover:bg-slate-100" onClick={() => signOut()}>
                            <div className="flex items-center gap-x-2">
                                <span className="font-semibold text-sm">SignOut</span><LogOut /> 
                            </div>
                        </button> : <button className="p-3 rounded-md border hover:bg-slate-100">
                            <Link href={"/sign-in"}>
                                <div className="flex items-center gap-x-2">
                                    <span className="font-semibold text-sm ">SignIn</span><LogIn /> 
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
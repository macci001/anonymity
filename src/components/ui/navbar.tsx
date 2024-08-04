"use client"

import { User } from "@/model/user";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
    const {data: session} = useSession();
    const user: User = session?.user as User; 
    return (
        <div className="flex p-4 items-center justify-between border-b">
            <div className="text-xl font-semibold">
                Anonymity
            </div>
            <div className="flex">
                <div className="px-4 flex items-center gap-x-2">
                    <div className="text-sm text-muted-foreground">Hello</div> 
                    <div className="font-semibold">{user?.username ? user?.username : user?.email}</div>
                </div>
                <div className="px-4">
                    {
                        session ? <button onClick={() => signOut()}>
                            <LogOut />
                        </button> : null
                    }
                </div>
            </div>
        </div>
    )
}
export default Navbar;
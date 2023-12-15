'use client'
import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Dashboard () {
    const { data: session} = useSession();

    return (
        <div className="">
            <div className="border w-40 p-2 mx-auto">
                <p className="text-lg">{session?.user?.name}</p>
                <p className="text-sm text-gray-400">{session?.user?.email}</p>
            </div>
            <div className="bg-blue-500 w-40 p-2 mx-auto text-center">
                <button onClick={() => signOut()}>Log out</button>
            </div>
        </div>
    )
}

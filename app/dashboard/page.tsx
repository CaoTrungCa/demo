'use client'
import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Dashboard () {
    const { data: session} = useSession();

    return (
        <div className="">
        </div>
    )
}

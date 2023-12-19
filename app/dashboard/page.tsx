'use client'
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if ((session?.user as any)?.is_admin === 'client') {
            router.push("/");
        }
    }, [session, router]);

    return (
        <div className="">
        </div>
    )
}

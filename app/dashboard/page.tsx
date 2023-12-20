"use client"
import DashboardContainer from "@/components/DashboardContainer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session?.user) {
            router.push("/");
        };
    }, []);


    return (
        <DashboardContainer>
            Ok
        </DashboardContainer>
    )
}

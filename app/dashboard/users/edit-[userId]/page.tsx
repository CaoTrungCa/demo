'use client'
import { useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from '@/firebase/firebase';
import { User } from "@/lib/collection";
import Image from "next/image";
import DashboardContainer from "@/components/DashboardContainer";

export default function EditUser({ params }: { params: any }) {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const router = useRouter();

    console.log(params)

    return (
        <DashboardContainer>
            <div className="h-10 w-full items-center flex p-8 gap-4 text-sm">
                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21" >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <p onClick={() => router.push('/dashboard')} className="hover:cursor-pointer">Dashboard</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p onClick={() => router.push('/dashboard/users')} className="hover:cursor-pointer">User</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p className="text-gray-400">Edit</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 shadow-lg rounded-lg p-6">

                </div>
                <form className="md:col-span-2 shadow-lg rounded-lg p-6">

                </form>
            </div>
        </DashboardContainer>
    )
}

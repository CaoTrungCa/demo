"use client"
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { app } from '@/firebase/firebase';
import PageContainer from "@/components/PageContainer";

export default function Register () {
    const db = getFirestore(app);

    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const emailQuery = await getDocs(
                query(collection(db, "users"), where("email", "==", email))
            );
            const usernameQuery = await getDocs(
                query(collection(db, "users"), where("username", "==", username))
            );

            if (!emailQuery.empty) {
                setError("Email already exists");
                return;
            }

            if (!usernameQuery.empty) {
                setError("Username already exists");
                return;
            }

            const id = `user_${Date.now().toString()}`;
            const createDate = new Date(Date.now()).toUTCString();
            await setDoc(doc(db, 'users', id), {
                id,
                email,
                username,
                password,
                create_date: createDate,
                is_admin: 'client'
            });
            e.target.reset();
            router.push("/auth/login");
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    return (
        <PageContainer>
            <div className="mx-auto md:w-96 min-[320px]:w-64 md:py-4 min-[320px]:py-4 shadow-md rounded">
                <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                    <div className='mx-auto md:py-5 min-[320px]:py-3 text-2xl'>
                        <span>Register</span>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                            placeholder="admin@gmail.com" required type="email" name="email" id="email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                            placeholder="admin" required type="username" name="username" id="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                            placeholder="" required type="password" name="password" id="password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto min-[320px]:w-20 px-5 py-2.5 text-center"
                    >
                        Register
                    </button>
                    <div className="text-sm py-4">
                        Already have an account? <Link href="/auth/login" className="hover:text-blue-800 hover:underline">Log in</Link>
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                </form>
            </div>
        </PageContainer>
    )
}

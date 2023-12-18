"use client"

import Link from "next/link";
import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login () {

    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await signIn("credentials", {
                username,
                password,
                redirect: false
            });
            router.replace("/");
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    return (
        <div className="mx-auto md:w-96 min-[320px]:w-64 md:py-4 min-[320px]:py-4 shadow-md rounded">
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <div className='mx-auto md:py-5 min-[320px]:py-3 text-2xl'>
                    <span>Login</span>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                        placeholder="admin" required type="text" name="email" id="email"
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
                    Login
                </button>
                <div className="text-sm py-4">
                    <Link href="/auth/reset-password" className="hover:text-blue-800 hover:underline">Forgot Password?</Link>
                </div>
                <div className="text-sm pb-4">
                    Not registered? <Link href="/auth/register" className="hover:text-blue-800 hover:underline">Create account</Link>
                </div>
                {error && <div className="text-red-500">{error}</div>}
            </form>
        </div>
    )
}

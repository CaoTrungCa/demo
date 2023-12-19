"use client"
import React, { useState } from "react";
import { getFirestore, doc, setDoc, getDocs, collection, where, query, updateDoc } from 'firebase/firestore';
import { app } from '@/firebase/firebase';
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/PageContainer";

export default function ResetPassword () {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState("");

    const router = useRouter();

    const db = getFirestore(app);

    const handleResetPassword = async (e: any) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match!");
            return;
        }

        const q = query(collection(db, 'users'), where('email', '==', email), where('username', '==', username));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'users', userDoc.id), { password: confirmNewPassword });

            setError('Password updated successfully!');
            router.push("/auth/login");
        } else {
            setError('Email or Username is incorrect!');
        }
    };

    return (
        <PageContainer>
            <div className="mx-auto md:w-96 min-[320px]:w-64 md:py-4 min-[320px]:py-4 shadow-md rounded">
                <form className="flex flex-col items-center" onSubmit={handleResetPassword}>
                    <div className='mx-auto md:py-5 min-[320px]:py-3 text-2xl'>
                        <span>Forgot password</span>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Your Email</label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                            placeholder="admin@gmail.com" required type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Your Username</label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                            placeholder="admin" required type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                            placeholder="" required type="password" name="new_password" id="new_password" onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Confirm New Password</label>
                        <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                            placeholder="" required type="password" name="confirm_new_password" id="confirm_new_password" onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm pb-4">{error}</div>}
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto min-[320px]:w-20 px-5 py-2.5 mb-6 text-center"
                    >
                        Reset password
                    </button>
                    <div className="text-sm pb-4">
                        Already have an account? <Link href="/auth/login" className="hover:text-blue-800 hover:underline">Log in</Link>
                    </div>
                </form>
            </div>
        </PageContainer>
    )
}

'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from '@/firebase/firebase';
import { Categories } from "@/lib/collection";
import DashboardContainer from "@/components/DashboardContainer";
import { useSession } from "next-auth/react";

export default function CreateUser() {
    const db = getFirestore(app);
    const router = useRouter();

    const [categories, setCategories] = useState<Categories>({
        id: "",
        title: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategories((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            const id = `categories_${Date.now().toString()}`;
            await setDoc(doc(db, 'categories', id), {
                ...categories,
                id: id,
            });
            router.push("/dashboard/categories");
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

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
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
                <p onClick={() => router.push('/dashboard/categories')} className="hover:cursor-pointer">Categories</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
                <p className="text-gray-400">New</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-1 gap-4">
                <form className="md:col-span-1 shadow-lg rounded-lg p-6">
                    <div className="pt-4">
                        <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Cao Bằng"
                            value={categories.title}
                            onChange={handleInputChange}
                            className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                        />
                    </div>
                    <div className="mt-4 py-4 flex">
                        <button type="button" onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                            Save
                        </button>
                        <div className="w-4"></div>
                        <button type="button" onClick={() => router.push('/dashboard/categories')} className="bg-gray-300 px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardContainer>
    )
}

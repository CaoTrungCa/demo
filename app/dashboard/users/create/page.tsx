'use client'
import { useState } from "react";
import { redirect, useRouter } from 'next/navigation';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from '@/firebase/firebase';
import { User } from "@/lib/collection";
import Image from "next/image";
import DashboardContainer from "@/components/DashboardContainer";

export default function CreateUser() {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const router = useRouter();

    const [user, setUser] = useState<User>({
        create_date: "",
        id: "",
        name: "",
        avatar: "",
        birthday: "",
        address: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        is_admin: "",
    });
    const [avatarUrl, setAvatarUrl] = useState("");
    const [userType, setUserType] = useState<string>("client");

    const handleUserTypeChange = (type: string) => {
        setUserType(type);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target.files as FileList)[0];

        if (file) {
            try {
                const id = `file_${Date.now().toString()}`;
                const fileRef = ref(storage, `user/${id}`);

                uploadBytes(fileRef, file)
                    .then(() => {
                        getDownloadURL(fileRef).then(async (downloadURL) => {
                            await setDoc(doc(db, "files", id), {
                                name: file.name,
                                type: file.name.split(".")[1],
                                size: file.size,
                                modifiedAt: file.lastModified,
                                imageUrl: downloadURL,
                                id: id
                            });

                            setAvatarUrl(downloadURL);
                        });
                    });
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleCreate = async () => {
        try {
            const id = `user_${Date.now().toString()}`;
            const createDate = new Date(Date.now()).toUTCString();
            await setDoc(doc(db, 'users', id), {
                ...user,
                id: id,
                create_date: createDate,
                avatar: avatarUrl || "",
                is_admin: userType,
            });
            router.push("/dashboard/users");
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
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p onClick={() => router.push('/dashboard/users')} className="hover:cursor-pointer">User</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p className="text-gray-400">New</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 shadow-lg rounded-lg p-6">
                    <div className="flex items-center w-full justify-center border-b">
                        <div className="m-4 p-4 mx-auto shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded">
                            <div className="p-2">
                                <Image width={128} height={128} className="w-32 h-32 rounded-full mx-auto" src={user.avatar ? user.avatar : "/user/avatar_default.jpg"} alt=""/>
                            </div>
                            <div className="p-2">
                                <h3 className="text-center text-2xl text-gray-900 font-medium leading-8">{user.name}</h3>
                                <div className="text-center text-gray-400 text-base font-semibold">
                                    <p>{user.birthday}</p>
                                </div>
                                <table className="text-base my-3">
                                    <tbody>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Address</td>
                                            <td className="px-2 py-2">{user.address}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                                            <td className="px-2 py-2">{user.phone}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                                            <td className="px-2 py-2">{user.email}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <form className="md:col-span-2 shadow-lg rounded-lg p-6">
                    <div className="h-32 w-32 justify-center items-center mx-auto">
                        <label>
                            <input
                                hidden
                                type="file"
                                id="avatar"
                                name="avatar"
                                onChange={(e) => handleFileChange(e)}
                            />
                            <div className="aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        width={100}
                                        height={100}
                                        alt={user.avatar}
                                        className="w-32 h-32 rounded-full"
                                    />
                                ) : (
                                    <span>Select Avatar</span>
                                )}
                            </div>
                        </label>
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Admin"
                                value={user.name}
                                onChange={handleInputChange}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Birthday</label>
                            <input
                                type="text"
                                id="birthday"
                                name="birthday"
                                placeholder="01-01-2000"
                                value={user.birthday}
                                onChange={handleInputChange}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Hải Phòng"
                            value={user.address}
                            onChange={handleInputChange}
                            className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                        />
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="admin@gmail.com"
                                value={user.email}
                                onChange={handleInputChange}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="0123456789"
                                value={user.phone}
                                onChange={handleInputChange}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="admin"
                                value={user.username}
                                onChange={handleInputChange}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                placeholder="admin"
                                value={user.password}
                                onChange={handleInputChange}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1 flex items-center">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white mr-2">User Type</label>
                            <div className="flex gap-x-2 text-sm">
                                <span
                                    className={`cursor-pointer px-3 py-1 rounded-lg ${userType === "admin" ? "bg-blue-500 text-white" : ""}`}
                                    onClick={() => handleUserTypeChange("admin")}
                                >
                                    Admin
                                </span>
                                <span
                                    className={`cursor-pointer px-3 py-1 rounded-lg ${userType === "client" ? "bg-blue-500 text-white" : ""}`}
                                    onClick={() => handleUserTypeChange("client")}
                                >
                                    Client
                                </span>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                        </div>
                    </div>
                    <div className="mt-4 py-4 flex">
                        <button type="button" onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                            Save
                        </button>
                        <div className="w-4"></div>
                        <button type="button" onClick={() => router.push('/dashboard/users')} className="bg-gray-300 text-white px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardContainer>
    )
}

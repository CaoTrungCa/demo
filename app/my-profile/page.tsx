"use client"
import { useSession } from "next-auth/react";
import { useState } from "react";
import { User } from "@/lib/collection";
import Image from "next/image";

export default function MyProfile() {
    const { data: session } = useSession();

    const [userProfile, setUserProfile] = useState<User>(() => {
        if (session?.user) {
            return {
                create_date: ((session.user as any) as any).create_date || "",
                id: (session.user as any).id || "",
                name: (session.user as any).name || "",
                avatar: (session.user as any).avatar || "/user/avatar_default.jpg",
                background: (session.user as any).background || "/user/bg_default.jpg",
                birthday: (session.user as any).birthday || "",
                address: (session.user as any).address || "",
                email: (session.user as any).email || "",
                phone: (session.user as any).phone || "",
                username: (session.user as any).username || "",
                password: (session.user as any).password || "",
                is_admin: (session.user as any).is_admin || "",
            };
        } else {
            return {
                create_date: "",
                id: "",
                name: "",
                avatar: "",
                background: "",
                birthday: "",
                address: "",
                email: "",
                phone: "",
                username: "",
                password: "",
                is_admin: "",
            };
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log("Saving profile:", userProfile);
    };

    const handleCancel = () => {
        console.log("Editing canceled");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg my-8">
            <form className="space-y-4">
                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                    <Image
                        src={userProfile.background}
                        layout="fill"
                        objectFit="cover"
                        alt={userProfile.name}
                    />
                    <div className="absolute bottom-0 left-0 p-2">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-white">
                            <Image
                                src={userProfile.avatar}
                                width={80}
                                height={80}
                                objectFit="cover"
                                alt={userProfile.name}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={userProfile.name}
                        onChange={handleInputChange}
                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1">Birthday</label>
                    <input
                        type="text"
                        name="birthday"
                        value={userProfile.birthday}
                        onChange={handleInputChange}
                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={userProfile.address}
                        onChange={handleInputChange}
                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1">Email</label>
                        <input
                            type="text"
                            name="email"
                            value={userProfile.email}
                            onChange={handleInputChange}
                            className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="phone" className="mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={userProfile.phone}
                            onChange={handleInputChange}
                            className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="username" className="mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={userProfile.username}
                            onChange={handleInputChange}
                            className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1">Password</label>
                        <input
                            type="text"
                            name="password"
                            value={userProfile.password}
                            onChange={handleInputChange}
                            className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1">Is Admin</label>
                    <input
                        type="text"
                        name="is_admin"
                        value={userProfile.is_admin}
                        onChange={handleInputChange}
                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

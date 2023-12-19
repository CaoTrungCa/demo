"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@/lib/collection";
import Image from "next/image";
import { getFirestore, doc, setDoc, getDocs, collection, where, query } from 'firebase/firestore';
import { app } from '@/firebase/firebase';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/PageContainer";

export default function MyProfile() {
    const { data: session } = useSession();
    const db = getFirestore(app);
    const storage = getStorage(app);

    const [userProfile, setUserProfile] = useState<User>({
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

    const [initialUserProfile, setInitialUserProfile] = useState<User>({ ...userProfile });
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    const fetchUserProfile = async (username: string) => {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'users'), where("username", "==", username)));

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data() as User;
                return userData;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
        return null;
    };

    const fetchUserProfileFromDB = async () => {
        if ((session?.user as any).username) {
            const fetchedProfile = await fetchUserProfile((session?.user as any).username);
            if (fetchedProfile) {
                setUserProfile(fetchedProfile);
                setInitialUserProfile({ ...fetchedProfile });
            }
        }
    };

    useEffect(() => {
        if (session) {
            fetchUserProfileFromDB();
        } else {
            router.push("/auth/login");
        }
    }, [session]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
        setInitialUserProfile({ ...userProfile });
    };

    const handleSave = async () => {
        try {
            await setDoc(doc(db, "users", userProfile.id), {
                ...userProfile,
            });

            setIsEditing(!isEditing);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    const handleCancel = () => {
        setUserProfile({ ...initialUserProfile });
        setIsEditing(!isEditing);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target.files as any)[0];

        if (file) {
            try {
                const id = `file_${Date.now().toString()}`;
                const fileRef = ref(storage, `user/${id}`);

                await uploadBytes(fileRef, file);
                const downloadURL = await getDownloadURL(fileRef);

                setUserProfile((prevProfile) => ({
                    ...prevProfile,
                    avatar: downloadURL,
                }));

                await setDoc(doc(db, "users", userProfile.id), {
                    ...userProfile,
                    avatar: downloadURL,
                });

            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    return (
        <PageContainer>
            <div className="max-w-5xl mx-auto p-6 rounded-lg shadow my-8 grid md:grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <div className="flex items-center w-full justify-center shadow-xl rounded-lg">
                        <div className="max-w-full">
                            <div className="bg-white">
                                <div className="p-2">
                                    <Image width={128} height={128} className="w-32 h-32 rounded-full mx-auto" src={userProfile.avatar ? userProfile.avatar : "/user/avatar_default.jpg"} alt={userProfile.name}/>
                                </div>
                                <div className="p-2">
                                    <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{userProfile.name}</h3>
                                    <div className="text-center text-gray-400 text-xs font-semibold">
                                        <p>{userProfile.birthday}</p>
                                    </div>
                                    <table className="text-xs my-3">
                                        <tbody><tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Address</td>
                                            <td className="px-2 py-2">{userProfile.address}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                                            <td className="px-2 py-2">{userProfile.phone}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                                            <td className="px-2 py-2">{userProfile.email}</td>
                                        </tr>
                                    </tbody></table>

                                    <div className="text-center my-3">
                                        <button onClick={handleEdit} className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium">Edit</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-3">
                    <form className="space-y-4 p-6 shadow-xl rounded-lg">
                        <div className="grid grid-cols-2 items-center space-x-4">
                            <div className="order-1">
                                <div className="relative w-full">
                                    {isEditing ? (
                                        <label>
                                            <input
                                                hidden
                                                type="file"
                                                id="background"
                                                name="background"
                                                className="w-full"
                                                onChange={(e) => handleFileChange(e)}
                                            />
                                            <div className="aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                                                {userProfile?.avatar ? (
                                                    <Image
                                                        src={userProfile?.avatar}
                                                        width={100}
                                                        height={100}
                                                        alt={userProfile?.avatar}
                                                        className="w-32 h-32 rounded-full"
                                                    />
                                                ) : (
                                                    <span>Select Avatar</span>
                                                )}
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="aspect-video rounded flex items-center justify-center border-2 border-dashed">
                                            <Image
                                                src={userProfile.avatar ? userProfile.avatar : "/user/avatar_default.jpg"}
                                                width={100}
                                                height={100}
                                                alt={userProfile?.avatar}
                                                className="w-32 h-32 rounded-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="order-2">
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Admin"
                                        value={userProfile.name}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="mb-1">Birthday</label>
                                    <input
                                        type="text"
                                        name="birthday"
                                        placeholder="04-12-2000"
                                        value={userProfile.birthday}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="name" className="mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Hải Phòng"
                                value={userProfile.address}
                                onChange={handleInputChange}
                                readOnly={!isEditing}
                                className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="email" className="mb-1">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="admin@gmail.com"
                                    value={userProfile.email}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="phone" className="mb-1">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="0123456789"
                                    value={userProfile.phone}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
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
                                    placeholder="admin"
                                    value={userProfile.username}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password" className="mb-1">Password</label>
                                <input
                                    type={isEditing ? "text" : "password"}
                                    name="password"
                                    placeholder=""
                                    value={userProfile.password}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className="border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                />
                            </div>
                        </div>
                        {isEditing &&
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
                        }
                    </form>
                </div>
            </div>
        </PageContainer>
    );
}

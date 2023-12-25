'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from '@/firebase/firebase';
import Image from "next/image";
import DashboardContainer from "@/components/DashboardContainer";

export default function EditUser({ params }: { params: any }) {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const router = useRouter();

    const [defaultUserData, setDefaultUserData] = useState({
        name: "",
        birthday: "",
        address: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        avatar: "",
        is_admin: "",
        create_date: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const q = query(collection(db, 'users'), where("id", "==", params.userId));
            try {
                const querySnapshot = await getDocs(q);
                const userDataArray: any[] = [];
                querySnapshot.forEach((doc) => {
                    userDataArray.push(doc.data());
                });

                if (userDataArray.length > 0) {
                    const user = userDataArray[0];
                    setDefaultUserData({
                        name: user.name || "",
                        birthday: user.birthday || "",
                        address: user.address || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        username: user.username || "",
                        password: user.password || "",
                        avatar: user.avatar || "",
                        is_admin: user.is_admin || "",
                        create_date: user.create_date || ""
                    });
                    setUserType(user.is_admin || "client");
                    setAvatarUrl(user.avatar || "");
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, [db, params.userId]);

    const [userData, setUserData] = useState({
        name: "",
        birthday: "",
        address: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        avatar: "",
        is_admin: "",
        create_date: "",
    });

    useEffect(() => {
        setUserData({
            name: defaultUserData.name || "",
            birthday: defaultUserData.birthday || "",
            address: defaultUserData.address || "",
            email: defaultUserData.email || "",
            phone: defaultUserData.phone || "",
            username: defaultUserData.username || "",
            password: defaultUserData.password || "",
            avatar: defaultUserData.avatar || "",
            is_admin: defaultUserData.is_admin || "",
            create_date: defaultUserData.create_date || "",
        });
    }, [defaultUserData]);

    const [userType, setUserType] = useState<string>("client");
    const [avatarUrl, setAvatarUrl] = useState("");

    const [isDelete, setIsDelete] = useState(false);
    const [idDelete, setIdDelete] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target.files as FileList)[0];

        if (file) {
            try {
                const id = `file_${Date.now().toString()}`;
                const fileRef = ref(storage, `user/${id}`);

                await uploadBytes(fileRef, file);

                const downloadURL = await getDownloadURL(fileRef);

                await setDoc(doc(db, "files", id), {
                    name: file.name,
                    type: file.name.split(".")[1],
                    size: file.size,
                    modifiedAt: file.lastModified,
                    imageUrl: downloadURL,
                    id: id
                });

                setAvatarUrl(downloadURL);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleUserTypeChange = (type: string) => {
        setUserType(type);
    };

    const handleEdit = async () => {
        try {
            await setDoc(doc(db, 'users', params.userId), {
                id: params.userId,
                name: userData.name,
                birthday: userData.birthday,
                address: userData.address,
                email: userData.email,
                phone: userData.phone,
                username: userData.username,
                password: userData.password,
                avatar: avatarUrl,
                is_admin: userType,
                create_date: userData.create_date,
            });
            router.push('/dashboard/users');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleDelete = async (userId: any) => {
        setIsDelete(!isDelete);
        setIdDelete(userId);
    }

    const cancelDelete = () => {
        setIsDelete(!isDelete);
    }

    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, 'users', idDelete));
            setIsDelete(!isDelete);
            router.push('/dashboard/users');
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

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
                    <div className="flex items-center w-full justify-center border-b">
                        <div className="m-4 p-4 mx-auto shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded">
                            <div className="p-2">
                                <Image width={128} height={128} className="w-32 h-32 rounded-full mx-auto" src={avatarUrl ? avatarUrl : "/user/avatar_default.jpg"} alt=""/>
                            </div>
                            <div className="p-2">
                                <h3 className="text-center text-2xl text-gray-900 font-medium leading-8">
                                    {userData.name}
                                </h3>
                                <div className="text-center text-gray-400 text-base font-semibold">
                                    <p>{userData.birthday}</p>
                                </div>
                                <table className="text-base my-3">
                                    <tbody>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Address</td>
                                            <td className="px-2 py-2">{userData.address}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                                            <td className="px-2 py-2">{userData.phone}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                                            <td className="px-2 py-2">{userData.email}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="text-center my-3">
                        <button className="justify-center items-center flex gap-2 w-full py-2 px-4 rounded-lg text-white bg-red-400"
                            onClick={() => handleDelete(params.userId)}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                            Delete User
                        </button>
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
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        width={100}
                                        height={100}
                                        alt={userData.avatar}
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
                                value={userData.name}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Birthday</label>
                            <input
                                type="text"
                                id="birthday"
                                name="birthday"
                                placeholder="01-01-2000"
                                value={userData.birthday}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
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
                            value={userData.address}
                            onChange={handleInputChange}
                            className="w-full pl-4  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
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
                                value={userData.email}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="0123456789"
                                value={userData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
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
                                value={userData.username}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                placeholder="admin"
                                value={userData.password}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
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
                        <button type="button" onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                            Save
                        </button>
                        <div className="w-4"></div>
                        <button type="button" onClick={() => router.push('/dashboard/users')} className="bg-gray-300 px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            {isDelete &&
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this user?</p>
                        <div className="flex justify-end">
                        <button onClick={() => cancelDelete()}
                            className="bg-gray-300 px-4 py-2 rounded-lg mr-2" >
                            Cancel
                        </button>
                        <button onClick={() => confirmDelete()}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg" >
                            Delete
                        </button>
                        </div>
                    </div>
                </div>
            }
        </DashboardContainer>
    )
}

'use client'
import { useState, useEffect } from "react";
import { collection, deleteDoc, getDocs, getFirestore, query, doc } from "firebase/firestore";
import { app } from '@/firebase/firebase';
import { User } from "@/lib/collection";
import DashboardContainer from "@/components/DashboardContainer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function UsersDashboard() {
    const { data: session } = useSession();

    const db = getFirestore(app);
    const [userData, setUserData] = useState<User[]>([]);

    const [isDelete, setIsDelete] = useState(false);
    const [idDelete, setIdDelete] = useState("");

    const router = useRouter();

    const fetchUserData = async () => {
        const q = query(collection(db, 'users'));
        try {
            const querySnapshot = await getDocs(q);
            const userDataArray: any = [];
            querySnapshot.forEach((doc) => {
                userDataArray.push(doc.data());
            });
            setUserData(userDataArray);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        if (!session?.user) {
            router.push("/");
        };
    }, []);

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
            fetchUserData();
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
                <p className="text-gray-400">User</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p className="text-gray-400">List</p>
            </div>
            <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between my-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="px-3 py-2 my-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 w-full md:w-auto"
                    />
                    <Link href="/dashboard/users/create">
                        <button className="justify-center items-center flex gap-2 py-2 px-4 rounded-lg text-white bg-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-add" viewBox="0 0 16 16">
                                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                                <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                            </svg>
                            New
                        </button>
                    </Link>
                </div>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full table-auto text-sm text-center rtl:text-right text-gray-500">
                        <thead className="text-xs text-white bg-blue-400 uppercase">
                            <tr>
                                <th></th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5">
                                    Name
                                </th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5 hidden md:table-cell">
                                    Birthday
                                </th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5 hidden md:table-cell">
                                    Phone
                                </th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5 hidden md:table-cell">
                                    Email
                                </th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5 hidden md:table-cell">
                                    Address
                                </th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        { userData.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={7} className="py-4 text-center">
                                        <p className="mx-auto">No data</p>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {userData.map((data) => (
                                    <tr key={data.id} className="bg-white border-b hover:bg-blue-100">
                                        <td className="min-[320px]:pl-4 md:pl-6 py-4 cursor-pointer">
                                            <Image
                                                src={data.avatar ? data.avatar : "/user/avatar_default.jpg"}
                                                width={32}
                                                height={32}
                                                alt={data.name || ""}
                                                className="rounded-full"
                                            />
                                        </td>
                                        <td
                                            className="min-[320px]:pr-4 md:pr-6 py-4 cursor-pointer"
                                        >
                                            {data.name}
                                        </td>
                                        <td
                                            className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer hidden md:table-cell"
                                        >
                                            {data.birthday}
                                        </td>
                                        <td
                                            className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer hidden md:table-cell"
                                        >
                                            {data.phone}
                                        </td>
                                        <td
                                            className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer hidden md:table-cell"
                                        >
                                            {data.email}
                                        </td>
                                        <td
                                            className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer hidden md:table-cell"
                                        >
                                            {data.address}
                                        </td>
                                        <td>
                                            <Link href={`/dashboard/users/edit/${data.id}`} className="justify-center items-center flex gap-2 py-2 px-4 rounded-lg text-white bg-blue-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                </svg>
                                                Edit
                                            </Link>
                                        </td>
                                        <td>
                                            <button className="justify-center items-center flex gap-2 py-2 px-4 rounded-lg text-white bg-red-400"
                                                onClick={() => handleDelete(data.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
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

'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { app } from '@/firebase/firebase';
import DashboardContainer from "@/components/DashboardContainer";

export default function EditCategpries({ params }: { params: any }) {
    const db = getFirestore(app);
    const router = useRouter();

    const [defaultCategoriesData, setDefaultCategoriesData] = useState({
        title: "",
    });

    useEffect(() => {
        const fetchcategoriesData = async () => {
            const q = query(collection(db, 'categories'), where("id", "==", params.categoriesId));
            try {
                const querySnapshot = await getDocs(q);
                const categoriesDataArray: any[] = [];
                querySnapshot.forEach((doc) => {
                    categoriesDataArray.push(doc.data());
                });

                if (categoriesDataArray.length > 0) {
                    const categories = categoriesDataArray[0];
                    setDefaultCategoriesData({
                        title: categories.title || ""
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchcategoriesData();
    }, [db, params.categoriesId]);

    const [categoriesData, setCategoriesData] = useState({
        title: "",
    });

    useEffect(() => {
        setCategoriesData({
            title: defaultCategoriesData.title || "",
        });
    }, [defaultCategoriesData]);

    const [isDelete, setIsDelete] = useState(false);
    const [idDelete, setIdDelete] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategoriesData({ ...categoriesData, [name]: value });
    };

    const handleEdit = async () => {
        try {
            await setDoc(doc(db, 'categories', params.categoriesId), {
                id: params.categoriesId,
                title: categoriesData.title,
            });
            router.push('/dashboard/categories');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleDelete = async (categoriesId: any) => {
        setIsDelete(!isDelete);
        setIdDelete(categoriesId);
    }

    const cancelDelete = () => {
        setIsDelete(!isDelete);
    }

    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, 'categories', idDelete));
            setIsDelete(!isDelete);
            router.push('/dashboard/categories');
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
                <p onClick={() => router.push('/dashboard/categories')} className="hover:cursor-pointer">Categories</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p className="text-gray-400">Edit</p>
            </div>
            <div className="p-6 grid grid-cols-1 gap-4">
                <form className="col-span-1 shadow-lg rounded-lg p-6">
                    <div className="pt-4">
                        <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Hải Phòng"
                            value={categoriesData.title}
                            onChange={handleInputChange}
                            className="w-full pl-4  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        />
                    </div>
                    <div className="mt-4 py-4 flex gap-4">
                        <button type="button" onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                            Save
                        </button>
                        <button type="button" onClick={() => router.push('/dashboard/categories')} className="bg-gray-300 px-4 py-2 mr-2 rounded-lg">
                            Cancel
                        </button>
                        <button type="button" onClick={() => handleDelete(params.categoriesId)} className="py-2 px-4 rounded-lg text-white bg-red-400">
                            Delete
                        </button>
                    </div>
                </form>
            </div>
            {isDelete &&
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this categories?</p>
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

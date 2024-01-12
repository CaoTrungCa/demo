'use client'
import { useState, useEffect } from "react";
import { deleteDoc, getFirestore, doc } from "firebase/firestore";
import { app } from '@/firebase/firebase';
import { Post } from "@/lib/collection";
import DashboardContainer from "@/components/DashboardContainer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchDataPost } from "@/lib/utils/fetchData";

export default function PostsDashboard() {
    const db = getFirestore(app);
    const [postData, setPostData] = useState<Post[]>([]);

    const [isDelete, setIsDelete] = useState(false);
    const [idDelete, setIdDelete] = useState("");
    const [searchTerm, setSearchTerm] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataPost([]);
            setPostData(data);
        }
        fetchData();
    }, []);

    const handleDelete = async (postId: any) => {
        setIsDelete(!isDelete);
        setIdDelete(postId);
    }

    const cancelDelete = () => {
        setIsDelete(!isDelete);
    }

    const confirmDelete = async () => {
        try {
            await deleteDoc(doc(db, 'posts', idDelete));
            setIsDelete(!isDelete);
            const updatedPostData = await fetchDataPost([]);
            setPostData(updatedPostData);
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    let filteredData = postData;

    if (searchTerm !== '') {
        filteredData = postData.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const indexOfLastData = currentPage * perPage;
    const indexOfFirstData = indexOfLastData - perPage;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(filteredData.length / perPage);

    const pageNumbers = [];
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        if(i < 1) continue;
        if(i > totalPages) break;

        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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
                <p className="text-gray-400">Post</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
                <p className="text-gray-400">List</p>
            </div>
            <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between my-4">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="px-3 py-2 my-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 w-full md:w-auto"
                    />
                    <Link href="/dashboard/posts/create">
                        <button className="justify-center items-center flex gap-2 py-2 px-4 rounded-lg text-white bg-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                            </svg>
                            New
                        </button>
                    </Link>
                </div>
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full table-auto text-sm rtl:text-right text-gray-500">
                        <thead className="text-xs text-white text-center bg-blue-400 uppercase">
                            <tr>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5">
                                    Category
                                </th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5 hidden md:table-cell">
                                    Title
                                </th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5 hidden md:table-cell">
                                    Content
                                </th>
                                <th scope="col" className="min-[320px]:px-4 md:px-6 py-5">
                                    Status
                                </th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        {currentData.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={7} className="py-4 text-center">
                                        <p className="mx-auto">No data</p>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {currentData.map((data, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-blue-100">
                                        <td
                                            className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer"
                                        >
                                            {data.categories}
                                        </td>
                                        <td
                                            className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer hidden md:table-cell"
                                        >
                                            {data.title}
                                        </td>
                                        <td className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer hidden md:table-cell">
                                            {data.content && (
                                                <div className="truncate-3-lines" dangerouslySetInnerHTML={{__html: (data.content)}} />
                                            )}
                                        </td>
                                        <td
                                            className="min-[320px]:px-4 md:px-6 py-4 cursor-pointer w-28 text-center"
                                        >
                                            <p className={`py-2 px-4 w-24 h-8 text-white rounded-lg ${data.status === 'Done' ? 'bg-green-400' : data.status === 'Draft' ? 'bg-gray-400' : ''}`}>
                                                {data.status}
                                            </p>
                                        </td>
                                        <td className="w-24 pr-4">
                                            <Link href={`/dashboard/posts/edit/${data.id}`} className="justify-center items-center flex gap-2 py-2 px-4 rounded-lg text-white bg-blue-400 w-24 h-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                </svg>
                                                Edit
                                            </Link>
                                        </td>
                                        <td className="w-24 pr-4">
                                            <button className="justify-center items-center flex gap-2 py-2 px-4 rounded-lg text-white bg-red-400 w-24 h-8"
                                                onClick={() => handleDelete(data.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                    {totalPages > 1 ?
                        <div className="text-center justify-center p-4 text-sm">
                            {
                                currentPage - 1 >= 1 && (
                                    <button onClick={() => handlePageChange(1)}
                                        className='h-9 w-9 mr-2 shadow-md border border-blue-gray-200 rounded-full'>
                                    {"«"}</button>
                                )
                            }
                            {pageNumbers.map((number) => (
                                <button
                                    key={number} onClick={() => handlePageChange(number)}
                                    className={`mr-2 shadow-md ${number == currentPage
                                        ? 'h-9 w-9 bg-blue-400 text-white rounded-full'
                                        : 'h-9 w-9 border border-blue-gray-200 rounded-full'}`}>
                                {number}</button>
                            ))}
                            {
                                currentPage + 1 <= totalPages && (
                                    <button onClick={() => handlePageChange(totalPages)}
                                        className='h-9 w-9 mr-2 shadow-md border border-blue-gray-200 rounded-full'>
                                    {"»"}</button>
                                )
                            }
                        </div> : <div />
                    }
                </div>
            </div>
            {isDelete &&
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this post?</p>
                        <div className="flex justify-end">
                            <button onClick={() => cancelDelete()}
                                className="bg-gray-300 text-white px-4 py-2 rounded-lg mr-2" >
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

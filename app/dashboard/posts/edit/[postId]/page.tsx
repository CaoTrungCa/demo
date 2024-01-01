'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { app } from '@/firebase/firebase';
import DashboardContainer from "@/components/DashboardContainer";
import Image from "next/image";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useSession } from "next-auth/react";

export default function EditPost({ params }: { params: any }) {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const router = useRouter();

    const { data: session } = useSession();

    const [defaultPostData, setDefaultPostData] = useState({
        title: "",
        slug: "",
        status: "",
        categories: "",
        image: "",
        content: "",
        user_created: "",
        date_created: "",
        user_updated: "",
        date_updated: ""
    });

    useEffect(() => {
        const fetchPostData = async () => {
            const q = query(collection(db, 'posts'), where("id", "==", params.postId));
            try {
                const querySnapshot = await getDocs(q);
                const postDataArray: any[] = [];
                querySnapshot.forEach((doc) => {
                    postDataArray.push(doc.data());
                });

                if (postDataArray.length > 0) {
                    const post = postDataArray[0];
                    setDefaultPostData({
                        title: post.title || "",
                        slug: post.slug || "",
                        status: post.status || "",
                        categories: post.categories || "",
                        image: post.image || "",
                        content: post.content || "",
                        user_created: post.user_created || "",
                        date_created: post.date_created || "",
                        user_updated: post.user_updated || "",
                        date_updated: post.date_updated || ""
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPostData();
    }, [db, params.postId]);

    const [postData, setPostData] = useState({
        title: "",
        slug: "",
        status: "",
        categories: "",
        image: "",
        content: "",
        user_created: "",
        date_created: "",
        user_updated: "",
        date_updated: ""
    });

    useEffect(() => {
        setPostData({
            title: defaultPostData.title || "",
            slug: defaultPostData.slug || "",
            status: defaultPostData.status || "",
            categories: defaultPostData.categories || "",
            image: defaultPostData.image || "",
            content: defaultPostData.content || "",
            user_created: defaultPostData.user_created || "",
            date_created: defaultPostData.date_created || "",
            user_updated: defaultPostData.user_updated || "",
            date_updated: defaultPostData.date_updated || ""
        });
    }, [defaultPostData]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesSnapshot = await getDocs(collection(db, 'categories'));
                const categoriesData = categoriesSnapshot.docs.map((doc) => doc.data().title);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [db]);

    const [isDelete, setIsDelete] = useState(false);
    const [idDelete, setIdDelete] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    const slugifyVietnamese = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-")
            .replace(/^-+/, "")
            .replace(/-+$/, "");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'title') {
            const slugValue = slugifyVietnamese(value);
            setPostData((prevPost) => ({
                ...prevPost,
                [name]: value,
                slug: slugValue,
            }));
        } else {
            setPostData((prevPost) => ({
                ...prevPost,
                [name]: value,
            }));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target.files as FileList)[0];

        if (file) {
            try {
                const id = `file_${Date.now().toString()}`;
                const fileRef = ref(storage, `post/${id}`);

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

                            setImageUrl(downloadURL);
                        });
                    });
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleEdit = async () => {
        try {
            await setDoc(doc(db, 'posts', params.postId), {
                id: params.postId,
                title: postData.title,
                slug: postData.slug,
                status: postData.status,
                categories: postData.categories,
                image: imageUrl,
                content: postData.content,
                user_created: postData.user_created,
                date_created: postData.date_created,
                user_updated: (session?.user as any).name,
                date_updated: new Date(Date.now()).toUTCString(),
            });
            router.push('/dashboard/posts');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

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
            router.push('/dashboard/posts');
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
                <p onClick={() => router.push('/dashboard/posts')} className="hover:cursor-pointer">Post</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p className="text-gray-400">Edit</p>
            </div>
            <div className="p-6 grid grid-cols-1 gap-4">
                <form className="col-span-1 shadow-lg rounded-lg p-6">
                <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Tiêu đề"
                                value={postData.title}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Slug</label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                placeholder="tieu-de"
                                value={postData.slug}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Categories</label>
                            <select
                                id="categories"
                                name="categories"
                                value={postData.categories}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            >
                                <option value="">Select category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={postData.status}
                                onChange={handleInputChange}
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            >
                                <option value="">Select Status</option>
                                <option value="draft">Draft</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">User Created</label>
                            <input
                                type="text"
                                id="user_created"
                                name="user_created"
                                placeholder=""
                                value={postData.user_created}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Date Created</label>
                            <input
                                type="text"
                                id="date_created"
                                name="date_created"
                                placeholder=""
                                value={postData.date_created}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">User Updated</label>
                            <input
                                type="text"
                                id="user_updated"
                                name="user_updated"
                                placeholder=""
                                value={postData.user_updated}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Date Updated</label>
                            <input
                                type="text"
                                id="date_updated"
                                name="date_updated"
                                placeholder=""
                                value={postData.date_updated}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            />
                        </div>
                    </div>
                    <div className="h-32 w-32 pt-4 justify-center items-center mx-auto">
                        <label>
                            <input
                                hidden
                                type="file"
                                id="avatar"
                                name="avatar"
                                onChange={(e) => handleFileChange(e)}
                            />
                            <div className="aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                                {postData.image ? (
                                    <Image
                                        src={postData.image}
                                        width={100}
                                        height={100}
                                        alt={postData.image}
                                        className="w-32 h-32 rounded-full"
                                    />
                                ) : (
                                    <span>Select Image</span>
                                )}
                            </div>
                        </label>
                    </div>
                    <div className="pt-4">
                        <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="Nội dung bài viết"
                            value={postData.content}
                            onChange={handleInputChange}
                            className="w-full pl-4  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        />
                    </div>
                    <div className="mt-4 py-4 flex gap-4">
                        <button type="button" onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                            Save
                        </button>
                        <button type="button" onClick={() => router.push('/dashboard/posts')} className="bg-gray-300 px-4 py-2 mr-2 rounded-lg">
                            Cancel
                        </button>
                        <button type="button" onClick={() => handleDelete(params.postId)} className="py-2 px-4 rounded-lg text-white bg-red-400">
                            Delete
                        </button>
                    </div>
                </form>
            </div>
            {isDelete &&
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this post?</p>
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

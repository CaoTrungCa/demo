'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from '@/firebase/firebase';
import { Post } from "@/lib/collection";
import Image from "next/image";
import DashboardContainer from "@/components/DashboardContainer";
import { useSession } from "next-auth/react";

export default function CreatePost() {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const router = useRouter();

    const { data: session } = useSession();

    const [post, setPost] = useState<Post>({
        user_created: "",
        date_created: "",
        user_updated: "",
        date_updated: "",
        id: "",
        title: "",
        slug: "",
        status: "",
        categories: "",
        image: "",
        content: ""
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const toggleStatusDropdown = () => {
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelectCategory = (category: string) => {
        setPost((prevPost) => ({
            ...prevPost,
            categories: category,
        }));
        setIsDropdownOpen(!isDropdownOpen);
    };

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
            setPost((prevPost) => ({
                ...prevPost,
                [name]: value,
                slug: slugValue,
            }));
        } else {
            setPost((prevPost) => ({
                ...prevPost,
                [name]: value,
            }));
        }
    };

    const handleStatusChange = (e: any) => {
        const { value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            status: value,
        }));
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
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

    const handleCreate = async () => {
        try {
            const id = `post_${Date.now().toString()}`;
            const createDate = new Date(Date.now()).toUTCString();
            const createUser = session?.user?.name;
            await setDoc(doc(db, 'posts', id), {
                ...post,
                id: id,
                date_created: createDate,
                user_created: createUser,
                user_updated: "",
                date_updated: "",
                image: imageUrl || "",
            });
            router.push("/dashboard/posts");
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
                <p onClick={() => router.push('/dashboard/posts')} className="hover:cursor-pointer">Post</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
                <p className="text-gray-400">New</p>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 shadow-lg rounded-lg p-6">
                </div>
                <form className="md:col-span-2 shadow-lg rounded-lg p-6">
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Tiêu đề"
                                value={post.title}
                                onChange={handleInputChange}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Slug</label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                placeholder="tieu-de"
                                value={post.slug}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                    </div>
                    <div className="gap-4 pt-4 grid md:grid-cols-2">
                        <div className="md:col-span-1 relative">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Categories</label>
                            <div className="relative">
                                <div
                                    className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2 cursor-pointer"
                                    onClick={toggleDropdown}
                                >
                                    {post.categories ? post.categories : 'Select Category'}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-down absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                                    </svg>
                                </div>
                                {isDropdownOpen && (
                                    <ul className="absolute z-10 mt-2 w-full text-sm bg-white rounded-md shadow-lg">
                                        <li onClick={() => handleSelectCategory('')} className="px-4 py-3 cursor-pointer hover:bg-blue-100" >
                                            Select Category
                                        </li>
                                        {categories.map((category, index) => (
                                            <li key={index} onClick={() => handleSelectCategory(category)} className="px-4 py-3 cursor-pointer hover:bg-blue-100" >
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                            <div className="relative">
                                <div
                                    className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2 cursor-pointer"
                                    onClick={toggleStatusDropdown}
                                >
                                    {post.status ? post.status : 'Select Status'}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-down absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                                    </svg>
                                </div>
                                {isStatusDropdownOpen && (
                                    <ul className="absolute z-10 mt-2 w-full text-sm bg-white rounded-md shadow-lg">
                                        <li onClick={() => handleStatusChange({ target: { value: '' } })} className="px-4 py-3 cursor-pointer hover:bg-blue-100" >
                                            Select Status
                                        </li>
                                        <li onClick={() => handleStatusChange({ target: { value: 'Draft' } })} className="px-4 py-3 cursor-pointer hover:bg-blue-100" >
                                            Draft
                                        </li>
                                        <li onClick={() => handleStatusChange({ target: { value: 'Done' } })} className="px-4 py-3 cursor-pointer hover:bg-blue-100" >
                                            Done
                                        </li>
                                    </ul>
                                )}
                            </div>
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
                                value={post.user_created}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Date Created</label>
                            <input
                                type="text"
                                id="date_created"
                                name="date_created"
                                placeholder=""
                                value={post.date_created}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
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
                                value={post.user_updated}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Date Updated</label>
                            <input
                                type="text"
                                id="date_updated"
                                name="date_updated"
                                placeholder=""
                                value={post.date_updated}
                                onChange={handleInputChange}
                                readOnly
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
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
                                {post.image ? (
                                    <Image
                                        src={post.image}
                                        width={100}
                                        height={100}
                                        alt={post.image}
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
                            value={post.content}
                            onChange={handleInputChange}
                            className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                        />
                    </div>
                    <div className="mt-4 py-4 flex">
                        <button type="button" onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                            Save
                        </button>
                        <div className="w-4"></div>
                        <button type="button" onClick={() => router.push('/dashboard/posts')} className="bg-gray-300 px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </DashboardContainer>
    )
}

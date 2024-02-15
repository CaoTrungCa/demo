
'use client'
import DashboardContainer from "@/components/DashboardContainer";
import { app } from "@/firebase/firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Setting } from "@/lib/collection";
import { fetchDataSetting } from "@/lib/utils/fetchData";

export default function SettingDashboard() {
    const db = getFirestore(app);
    const storage = getStorage(app);
    const router = useRouter();

    const [isReadOnly, setIsReadOnly] = useState(true);

    const [logo, setLogo] = useState("");
    const [settingData, setSettingData] = useState<Setting>({
        create_date: "",
        id: "",
        logo: "",
        web_name: "",
        address: "",
        phone: "",
        email: "",
        link_facebook: "",
        link_tiktok: "",
        link_github: "",
        link_youtube: "",
        title: "",
        description: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataSetting();
            setSettingData(data);
        }
        fetchData();
    }, [])

    const handleEdit = async () => {
        setIsReadOnly(!isReadOnly);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = (e.target.files as FileList)[0];

        if (file) {
            try {
                const id = `file_${Date.now().toString()}`;
                const fileRef = ref(storage, `setting/${id}`);

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

                            setSettingData((prevProfile) => ({
                                ...prevProfile,
                                logo: downloadURL,
                            }));

                            await setDoc(doc(db, "settings", settingData.id), {
                                ...settingData,
                                logo: downloadURL,
                            });
                        });
                    });
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettingData({ ...settingData, [name]: value });
    };

    const handleSave = async () => {
        try {
            await setDoc(doc(db, 'settings', settingData.id), {
                id: settingData.id,
                create_date: settingData.create_date,
                logo: settingData.logo,
                web_name: settingData.web_name,
                address: settingData.address,
                phone: settingData.phone,
                email: settingData.email,
                link_facebook: settingData.link_facebook,
                link_tiktok: settingData.link_tiktok,
                link_github: settingData.link_github,
                link_youtube: settingData.link_youtube,
                title: settingData.title,
                description: settingData.description
            });

            setIsReadOnly(!isReadOnly);
            router.push("/dashboard/setting");
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    const handleCancel = () => {
        setIsReadOnly(!isReadOnly);
        router.push("/dashboard/setting");
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
                <p className="text-gray-400">Setting</p>
            </div>
            <div className="p-6">
                <div className="md:col-span-2 shadow-lg rounded-lg p-6">
                    <div className="mt-4 rounded-lg border border-dashed p-4">
                        <h1 className="text-xl font-bold flex gap-2 items-center text-gray-900 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-globe" viewBox="0 0 16 16">
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472M3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
                            </svg>
                            Global
                        </h1>
                        <div className="h-32 w-32 mt-4 justify-center items-center mx-auto">
                            {!isReadOnly ? (
                                <label>
                                    <input
                                        hidden
                                        type="file"
                                        id="avatar"
                                        name="avatar"
                                        className="w-full"
                                        onChange={(e) => handleFileChange(e)}
                                    />
                                    <div className="aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
                                        {settingData.logo ? (
                                            <Image
                                                src={settingData.logo}
                                                width={100}
                                                height={100}
                                                alt={settingData.logo}
                                                className="w-32 h-32 rounded-full"
                                            />
                                        ) : (
                                            <span>Select Logo</span>
                                        )}
                                    </div>
                                </label>
                            ) : (
                                <div className="aspect-video rounded flex items-center justify-center border-0 border-dashed">
                                    <Image
                                        src={settingData.logo ? settingData.logo : "https://flowbite.com/docs/images/logo.svg"}
                                        width={100}
                                        height={100}
                                        alt={settingData.logo}
                                        className="w-32 h-32 rounded-full"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="pt-4">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Web Name</label>
                            <input
                                type="text"
                                id="web_name"
                                name="web_name"
                                placeholder="Coder Đi Phượt"
                                readOnly={isReadOnly}
                                value={settingData.web_name}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                    </div>
                    <div className="mt-4 rounded-lg border border-dashed p-4">
                        <h1 className="text-xl font-bold flex gap-2 items-center text-gray-900 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                            </svg>
                            Contact
                        </h1>
                        <div className="pt-4">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                placeholder="Hải Phòng"
                                readOnly={isReadOnly}
                                value={settingData.address}
                                onChange={(e) => handleInputChange(e)}
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
                                    readOnly={isReadOnly}
                                    value={settingData.email}
                                    onChange={(e) => handleInputChange(e)}
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
                                    readOnly={isReadOnly}
                                    value={settingData.phone}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 rounded-lg border border-dashed p-4">
                        <h1 className="text-xl font-bold flex gap-2 items-center text-gray-900 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-joystick" viewBox="0 0 16 16">
                                <path d="M10 2a2 2 0 0 1-1.5 1.937v5.087c.863.083 1.5.377 1.5.726 0 .414-.895.75-2 .75s-2-.336-2-.75c0-.35.637-.643 1.5-.726V3.937A2 2 0 1 1 10 2"/>
                                <path d="M0 9.665v1.717a1 1 0 0 0 .553.894l6.553 3.277a2 2 0 0 0 1.788 0l6.553-3.277a1 1 0 0 0 .553-.894V9.665c0-.1-.06-.19-.152-.23L9.5 6.715v.993l5.227 2.178a.125.125 0 0 1 .001.23l-5.94 2.546a2 2 0 0 1-1.576 0l-5.94-2.546a.125.125 0 0 1 .001-.23L6.5 7.708l-.013-.988L.152 9.435a.25.25 0 0 0-.152.23"/>
                            </svg>
                            SEO
                        </h1>
                        <div className="pt-4">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="What's the website title?"
                                readOnly={isReadOnly}
                                value={settingData.title}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                        <div className="pt-4">
                            <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder=""
                                readOnly={isReadOnly}
                                value={settingData.description}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                            />
                        </div>
                    </div>
                    <div className="mt-4 rounded-lg border border-dashed p-4">
                        <h1 className="text-xl font-bold flex gap-2 items-center text-gray-900 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                            </svg>
                            Social
                        </h1>
                        <div className="gap-4 pt-4 grid md:grid-cols-2">
                            <div className="md:col-span-1">
                                <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Link Facebook</label>
                                <input
                                    type="text"
                                    id="link_facebook"
                                    name="link_facebook"
                                    placeholder=""
                                    readOnly={isReadOnly}
                                    value={settingData.link_facebook}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Link Tiktok</label>
                                <input
                                    type="text"
                                    id="link_tiktok"
                                    name="link_tiktok"
                                    placeholder=""
                                    readOnly={isReadOnly}
                                    value={settingData.link_tiktok}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                                />
                            </div>
                        </div>
                        <div className="gap-4 pt-4 grid md:grid-cols-2">
                            <div className="md:col-span-1">
                                <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Link Github</label>
                                <input
                                    type="text"
                                    id="link_github"
                                    name="link_github"
                                    placeholder=""
                                    readOnly={isReadOnly}
                                    value={settingData.link_github}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block my-2 text-sm font-medium text-gray-900 dark:text-white">Link Youtube</label>
                                <input
                                    type="text"
                                    id="link_youtube"
                                    name="link_youtube"
                                    placeholder=""
                                    readOnly={isReadOnly}
                                    value={settingData.link_youtube}
                                    onChange={(e) => handleInputChange(e)}
                                    className="w-full pl-4 border-b focus:outline-none focus:border-blue-400 focus:border-b-2 text-gray-900 text-sm block p-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 py-4 flex">
                        {isReadOnly ? (
                            <button type="button" onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                                Edit
                            </button>
                        ) : (
                            <>
                                <button type="button" onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 mr-2 rounded-lg">
                                    Save
                                </button>
                                <button type="button" onClick={handleCancel} className="bg-gray-300 text-white px-4 py-2 rounded-lg">
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardContainer>
    )
}

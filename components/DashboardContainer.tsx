'use client'
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PageContainerProps {
    className?: string
    children?: React.ReactNode
}

export default function DashboardContainer({ children }: PageContainerProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleOptionChange = (option: string) => {
        setIsSidebarOpen(false);

        switch (option) {
            case 'dashboard':
                router.push('/dashboard');
                break;
            case 'users':
                router.push('/dashboard/users');
                break;
            case 'posts':
                router.push('/dashboard/posts');
                break;
            default:
                router.push('/dashboard');
                break;
        }
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        if ((session?.user as any)?.is_admin === 'client') {
            router.push("/");
        };
    }, [session, router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div>
            <button
                onClick={handleSidebarToggle}
                data-drawer-target="sidebar-multi-level-sidebar"
                data-drawer-toggle="sidebar-multi-level-sidebar"
                aria-controls="sidebar-multi-level-sidebar"
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path clipRule="evenodd" fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                </svg>
            </button>

            <aside
                id="sidebar-multi-level-sidebar" aria-label="Sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
                }`}
            >
                <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto shadow bg-white">
                    <div>
                        <ul className="space-y-2 font-medium">
                            <li className="border-b">
                                <div className="flex items-center p-2 text-gray-900 rounded-lg">
                                    <Image
                                        src={(session?.user as any)?.avatar ? (session?.user as any)?.avatar : "/user/avatar_default.jpg"}
                                        width={40}
                                        height={40}
                                        alt={session?.user?.name || ""}
                                        className="rounded-full"
                                    />
                                    <div className="ms-2">
                                        <span>{session?.user?.name}</span>
                                        <span className="block text-sm text-gray-500">{session?.user?.email}</span>
                                    </div>
                                </div>
                            </li>
                            <li onClick={() => handleOptionChange('dashboard')}>
                                <div
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 21"
                                    >
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    <span className="ms-3">Dashboard</span>
                                </div>
                            </li>
                            <li onClick={() => handleOptionChange('users')}>
                                <div
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <svg
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 18"
                                    >
                                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                                </div>
                            </li>
                            <li onClick={() => handleOptionChange('posts')}>
                                <div
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 32 32"
                                    >
                                        <path d="M25,4H7C4.2,4,2,6.2,2,9v14c0,2.8,2.2,5,5,5h18c2.8,0,5-2.2,5-5V9C30,6.2,27.8,4,25,4z M7,11c0-0.6,0.4-1,1-1h6
                                        c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1H8c-0.6,0-1-0.4-1-1V11z M24,22H8c-0.6,0-1-0.4-1-1s0.4-1,1-1h16c0.6,0,1,0.4,1,1S24.6,22,24,22z
                                        M24,18h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6c0.6,0,1,0.4,1,1S24.6,18,24,18z"/>
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">
                                        Posts
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-auto border-t">
                        <ul className="space-y-2 font-medium">
                            <li onClick={handleSignOut}>
                                <div
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <svg
                                        className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 18 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                                        />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
            <div className="sm:ml-64">
                {children}
            </div>
        </div>
    )
}

'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { FiMoon, FiSun } from "react-icons/fi"

interface BannerBlockProps {
    front_page: boolean
    path_banner: string
}

export default function BannerBlock({front_page, path_banner}: BannerBlockProps) {
    const [theme, setTheme] = useLocalStorage("theme", "dark")

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    };

    useEffect(() => {
        const body = document.body;
        body.setAttribute("data-theme", theme);
    }, [theme])
    return (
        <div className="relative">
            {front_page === true ? <div className="fixed top-0 left-0 w-full z-50 py-4 px-8">
                    <div className="flex justify-between items-center backdrop-filter backdrop-blur bg-icon-theme p-6 rounded-md shadow-md">
                        <div className="">
                            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                                <Image width={50} height={50} src={"https://flowbite.com/docs/images/logo.svg"} className="h-8 mr-1" alt="Coder Đi Phượt" />
                                <span className="self-center text-2xl text-icon-theme font-semibold whitespace-nowrap">Cao Trung</span>
                            </Link>
                        </div>
                        <div className="flex justify-center gap-10 text-icon-theme">
                            <Link href={'/about'} className="hover:font-bold">About us</Link>
                            <Link href={'/document'} className="hover:font-bold">Document</Link>
                            <Link href={'/contact'} className="hover:font-bold">Contact</Link>
                        </div>
                        <div className="text-icon-theme">
                            <button onClick={toggleTheme}>
                                {theme === "dark" ? (
                                    <FiMoon className="w-5 h-5" />
                                ) : (
                                    <FiSun className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div> : <div>
                </div>
            }
            <div className="h-screen w-full relative z-0">
                <video className="absolute inset-0 object-cover w-full h-full" autoPlay loop muted>
                    <source src={path_banner} type="video/mp4" />
                </video>
            </div>
        </div>
    )
}

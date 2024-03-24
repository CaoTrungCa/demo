'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi"

interface BannerBlockProps {
    front_page: boolean
    path_banner: string
}

export default function BannerBlock({front_page, path_banner}: BannerBlockProps) {
    const [theme, setTheme] = useLocalStorage("theme", "dark")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    useEffect(() => {
        const body = document.body
        body.setAttribute("data-theme", theme)
    }, [theme])

    return (
        <div className="relative">
            <div className="fixed top-0 left-0 w-full z-10 lg:py-4 lg:px-8">
                <div className="flex justify-between items-center backdrop-filter backdrop-blur bg-icon-theme p-6 rounded-md shadow-md">
                    <div className="">
                        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <Image width={50} height={50} src={"https://flowbite.com/docs/images/logo.svg"} className="h-8 mr-1" alt="Coder Đi Phượt" />
                            <span className="self-center text-2xl text-icon-theme font-semibold whitespace-nowrap">Cao Trung</span>
                        </Link>
                    </div>
                    <div className="hidden lg:flex justify-center gap-10 text-icon-theme">
                        <Link href={'/about'} className="hover:font-bold">About us</Link>
                        <Link href={'/document'} className="hover:font-bold">Document</Link>
                        <Link href={'/contact'} className="hover:font-bold">Contact</Link>
                    </div>
                    <div onClick={toggleTheme} className="hidden text-icon-theme border border-icon-theme hover:scale-125 rounded-md w-7 h-7 lg:flex items-center justify-center">
                        {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </div>
                    <div className="lg:hidden flex gap-3">
                        <div onClick={toggleTheme} className="lg:hidden text-icon-theme border border-icon-theme hover:scale-125 rounded-md w-7 h-7 flex items-center justify-center">
                            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </div>
                        <div className="lg:hidden">
                            <div onClick={toggleMobileMenu} className="border border-icon-theme hover:scale-125 rounded-md w-7 h-7 flex items-center justify-center" >
                                <FiMenu className="w-5 h-5 text-icon-theme" />
                            </div>
                        </div>
                    </div>
                    {isMobileMenuOpen && (
                        <div className="lg:hidden fixed inset-0 h-screen w-full bg-menu z-20">
                            <div className="shadow-sm py-2 flex items-center justify-between">
                                <Link href="/" className="my-4 ml-4 flex items-center">
                                    <Image width={50} height={50} src={"https://flowbite.com/docs/images/logo.svg"} className="h-8 mr-1" alt="Coder Đi Phượt" />
                                    <span className="self-center text-2xl text-icon-theme font-semibold whitespace-nowrap">Cao Trung</span>
                                </Link>
                                <div onClick={toggleMobileMenu} className="my-4 mr-4 text-icon-theme border border-icon-theme hover:scale-125 rounded-md w-7 h-7 flex items-center justify-center">
                                    <FiX className="w-5 h-5" />
                                </div>
                            </div>
                            <ul className="flex flex-col justify-center items-center text-icon-theme border-t">
                                <li className="py-2 text-center border-b ">
                                    <Link href={'/about'} className="hover:font-bold">About us</Link>
                                </li>
                                <li className="py-2 text-center border-b ">
                                    <Link href={'/document'} className="hover:font-bold">Document</Link>
                                </li>
                                <li className="py-2 text-center border-b ">
                                    <Link href={'/contact'} className="hover:font-bold">Contact</Link>
                                </li>
                            </ul>
                        </div>
                        )}
                </div>
            </div>
            <div className="h-screen w-full relative z-0">
                <video className="absolute inset-0 object-cover w-full h-full" autoPlay loop muted>
                    <source src={path_banner} type="video/mp4" />
                </video>
                <div className="absolute bg-icon-theme text-icon-theme backdrop-blur px-6 py-4 lg:right-1/2 lg:left-8 lg:bottom-20 bottom-0 rounded-md">
                    <p className="">{`"Khám phá cuộc sống qua những con đường đồi núi, ngắm nhìn những bức tranh tự nhiên tuyệt đẹp mà chỉ có thể tìm thấy khi bạn bước chân ra khỏi vùng an toàn của mình. Hãy để những cuộc phiêu lưu trên đường phượt thổi bay mọi lo âu, đưa bạn đến những trải nghiệm mới mẻ và kích thích tinh thần. Hãy bắt đầu hành trình của mình và khám phá vẻ đẹp của thế giới qua con đường của riêng bạn."`}</p>
                    <p className="font-bold text-[25px] text-right">- Cao Trung -</p>
                </div>
            </div>
        </div>
    )
}

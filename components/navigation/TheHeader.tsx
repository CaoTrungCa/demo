'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TheHeader() {
  const { data: session } = useSession();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileMenuUserOpen, setMobileMenuUserOpen] = useState(false);
  const router = useRouter();

  const toggleMobileMenuUser = () => {
    setMobileMenuUserOpen(!isMobileMenuUserOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuItemClick = () => {
    setMobileMenuUserOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <Image width={50} height={50} src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Cao Trung" />
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap">Cao Trung</span> */}
          </Link>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            {session?.user ? (
              <div>
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
                  id="user-menu-button"
                  aria-expanded={isMobileMenuUserOpen}
                  onClick={toggleMobileMenuUser}
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open User Menu</span>
                  <Image
                    width={64}
                    height={64}
                    src={'https://flowbite.com/docs/images/logo.svg'}
                    className="w-8 h-8 rounded-full"
                    alt="Cao Trung"
                  />
                </button>
                <div
                  className={`absolute right-0 mt-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow top-full w-52 ${
                    isMobileMenuUserOpen ? 'block' : 'hidden'
                  }`}
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">{session?.user.name}</span>
                    <span className="block text-sm text-gray-500 truncate">{session?.user.email}</span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button" onClick={handleMenuItemClick}>
                    <li>
                      <Link href="/my-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      {(session.user as any).is_admin && (session.user as any).is_admin === 'admin' ?
                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Dashboard
                        </Link>
                      : null }
                    </li>
                    <li>
                      <p onClick={handleSignOut} className="block hover:cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <Link href="/auth/login" className="hover:text-blue-400">
                  Login
                </Link>
              </div>
            )}
            <div className="flex md:order-2">
              <button
                data-collapse-toggle="navbar-cta"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-controls="navbar-cta"
                aria-expanded={isMobileMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open Menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>
          </div>
          <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link href="/" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/service" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

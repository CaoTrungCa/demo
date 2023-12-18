import Link from "next/link"

export default function TheFooter() {
    return (
        <footer className="bg-white shadow dark:bg-gray-900">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8 text-center">
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023
                <Link href="#" className="hover:underline"> Cao Trung</Link>
                </span>
            </div>
        </footer>
    )
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        <div className="bg-blue-500 w-40 p-2 mx-auto text-center">
            <Link href="/auth/login">Log in</Link>
        </div>
      </div>
    </main>
  )
}

import React from "react";

export default function ResetPassword () {

    return (
        <div className="mx-auto md:w-96 min-[320px]:w-64 md:py-4 min-[320px]:py-4 shadow-md rounded">
            <form className="flex flex-col items-center">
                <div className='mx-auto md:py-5 min-[320px]:py-3 text-2xl'>
                    <span>Reset password</span>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Your Email</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block md:w-72 min-[320px]:w-52 p-2.5"
                        placeholder="admin@gmail.com" required type="email" name="email" id="email"
                    />
                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto min-[320px]:w-20 px-5 py-2.5 mb-6 text-center"
                >
                    Reset password
                </button>
            </form>
        </div>
    )
}

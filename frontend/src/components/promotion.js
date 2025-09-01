"use client";
import Link from "next/link";
export default function Promotion({close}) {
    return (
        <div className="md:grid md:grid-cols-2 max-w-4xl bg-white mx-4 md:mx-auto rounded-xl h-[600px]">
            <img src="https://images.pexels.com/photos/5716027/pexels-photo-5716027.jpeg"
                alt="promotional" className="hidden md:block w-full max-w-lg rounded-l-xl h-full object-cover" />
            <div className="relative flex items-center justify-center">
                <button onClick = {close} className="absolute top-6 right-6 bg-gray-200 rounded-full p-2.5" aria-label="Close">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2 2 13M2 2l11 11" stroke="#1F2937" strokeOpacity=".7" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="max-md:py-20 px-6 md:px-10 text-center">
                    <h1 className="text-3xl font-bold">
                        <span className="text-blue-600">Get your free Medical Health Report</span> with AI in seconds
                    </h1>
                    <p className="mt-4 text-gray-500 mb-8">
                        Get your free Medical Health Report with AI in seconds
                    </p>
                    <Link href="/register" className="cursor-pointer rounded-lg bg-blue-600 text-sm px-14 py-3 mt-9 text-white">
                        Register Now
                    </Link>
                    
                </div>
            </div>
        </div>
    );
};
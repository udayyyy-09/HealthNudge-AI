"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const UploadHero = () => {
  return (
    <div className="bg-gray-50">
      <header className="py-4 md:py-6">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex shrink-0">
              <Link href="/" className="flex">
                <Image
                  className="w-auto h-20"
                  src="/images/logo.png"
                  alt="logo"
                  width={80}
                  height={80}
                  priority
                />
              </Link>
            </div>

            <div className="flex lg:hidden">
              <button type="button" className="text-gray-900">
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="hidden lg:flex lg:ml-10 xl:ml-16 lg:items-center lg:justify-center lg:space-x-8 xl:space-x-16">
              <Link
                href="/"
                className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                Home
              </Link>

              <Link
                href="/dashboard"
                className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                Dashboard
              </Link>

              <Link
                href="/Abt"
                className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                About
              </Link>
            </div>

            <div className="hidden lg:ml-auto lg:flex lg:items-center lg:space-x-8 xl:space-x-10">
              <Link
                href="/login"
                className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="px-5 py-2 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl hover:bg-gray-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="pt-12 pb-12 sm:pb-16 lg:pt-8">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
            <div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
                  From Confusion to Clarity — AI Reads Your Medical Report.
                </h1>
                <p className="mt-2 text-lg text-gray-600 sm:mt-8 font-inter">
                  Easily upload your medical test report—PDF or image—and get an
                  AI-powered summary highlighting key findings, potential
                  abnormalities, and general health recommendations. Designed to
                  assist, not replace, professional advice, our analysis helps
                  you make sense of complex results with clarity and confidence.
                </p>
              </div>

              <div className="flex items-center justify-center mt-10 space-x-6 lg:justify-start sm:space-x-8">
                <div className="flex items-center">
                  <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">
                    100+
                  </p>
                  <p className="ml-3 text-sm text-gray-900 font-pj">
                    ratings
                    <br />
                    Delivered
                  </p>
                </div>

                <div className="hidden sm:block">
                  <svg
                    className="text-gray-400"
                    width="16"
                    height="39"
                    viewBox="0 0 16 39"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="0.72" y1="10.58" x2="15.72" y2="0.58"></line>
                    <line x1="0.72" y1="17.58" x2="15.72" y2="7.58"></line>
                    <line x1="0.72" y1="24.58" x2="15.72" y2="14.58"></line>
                    <line x1="0.72" y1="31.58" x2="15.72" y2="21.58"></line>
                    <line x1="0.72" y1="38.58" x2="15.72" y2="28.58"></line>
                  </svg>
                </div>

                <div className="flex items-center">
                  <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">
                    $0
                  </p>
                  <p className="ml-3 text-sm text-gray-900 font-pj">
                    Free
                    <br />
                    Analysis
                  </p>
                </div>
              </div>
            </div>

            <div>
              <img
                className="w-full h-[500px] object-cover rounded-xl"
                src="https://plus.unsplash.com/premium_photo-1726769176212-1ab1fd60f42a?w=600&auto=format&fit=crop&q=60"
                alt="upload image"
                width={600}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default UploadHero;

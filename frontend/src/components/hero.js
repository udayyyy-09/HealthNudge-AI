"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function Hero() {
  const router = useRouter();


  return (
    <div className="relative pt-48 pb-12 bg-black xl:pt-60 sm:pb-16 lg:pb-32 xl:pb-48 2xl:pb-56">
        
      <header className="absolute inset-x-0 top-0 z-10 py-8 xl:py-12">
        <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex flex-shrink-0">
              {/* <a href="#" title="BakerStreet" className="inline-flex rounded-md focus:ring-offset-secondary focus:ring-primary">
                                <img className="w-auto h-18" src="/images/logo.png" alt="BakerStreet" />
                            </a> */}
            </div>

            <div className="md:hidden">
              <button
                type="button"
                className="p-2 -m-2 transition-all duration-200 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-10 lg:ml-28">
              <a
                href="/Abt"
                title=""
                className="font-sans text-base font-normal transition-all duration-200 rounded bg-transparent text-white  focus:ring-primary focus:ring-offset-secondary"
              >
                {" "}
                About{" "}
              </a>
              <a
                href="/login"
                title=""
                className="font-sans text-base font-normal transition-all duration-200 rounded bg-transparent text-white focus:ring-primary focus:ring-offset-secondary cursor-pointer "
              >
                {" "}
                Login{" "}
              </a>
              <a
                href="/dashboard"
                // title=""
                
                className="font-sans text-base font-normal transition-all duration-200 rounded bg-transparent text-white focus:ring-primary focus:ring-offset-secondary cursor-pointer "
              >
                
                DashBoard
              </a>

              <a
                href="/register"
                title=""
                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    px-5
                                    py-2
                                    font-sans
                                    text-base
                                    font-normal
                                    leading-7
                                    transition-all
                                    duration-200
                                    border-2
                                    rounded-full
                                    text-white
                                    border-primary
                                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary
                                    hover:bg-white hover:text-black
                                    focus:ring-offset-secondary
                                    cursor-pointer
                                "
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Background with right-to-left blur effect */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-right"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Additional blur overlay for stronger effect */}
        <div
          className="absolute inset-0 bg-cover bg-right"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')",
            filter: "blur(8px)",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
          }}
        />
      </div>

      <div className="relative">
        <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
          <div className="w-full lg:w-2/3 xl:w-1/2">
            <h1 className="font-sans text-base font-normal tracking-tight text-white">
              Your Personall AI health Tracker
            </h1>
            <p className="mt-6 tracking-tighter text-white">
              <span className="font-sans font-normal text-7xl">
                HealthNudge- Wellness
              </span>

              <br />
              <span className="font-serif italic font-normal text-8xl">
                Enhanced by AI
              </span>
            </p>
            <p className="mt-12 font-sans font-normal leading-7 text-white text-2xl">
              Get personalized tips, diet plans, and report insights — built
              just for you.
            </p>
            <p className="mt-8 font-sans text-xl font-normal text-white">
              Starting at $9.99/month
            </p>

            <div className="flex items-center mt-5 space-x-3 sm:space-x-4">
              <a
                href="#"
                title=""
                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    px-5
                                    py-2
                                    font-sans
                                    text-base
                                    font-semibold
                                    transition-all
                                    duration-200
                                    border-2 border-transparent
                                    rounded-full
                                    sm:leading-8
                                    bg-white
                                    sm:text-lg
                                    text-black
                                    hover:bg-opacity-90
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-secondary
                                "
                role="button"
              >
                Get started
              </a>

              <a
                href="#"
                title=""
                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    px-5
                                    py-2
                                    font-sans
                                    text-base
                                    font-semibold
                                    transition-all
                                    duration-200
                                    bg-transparent
                                    border-2
                                    rounded-full
                                    sm:leading-8
                                    text-white
                                    border-primary
                                    hover:bg-white
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                                    hover:text-black
                                    sm:text-lg
                                    focus:ring-offset-secondary
                                "
                role="button"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.0416 4.9192C7.37507 4.51928 6.5271 4.99939 6.5271 5.77669L6.5271 18.2232C6.5271 19.0005 7.37507 19.4806 8.0416 19.0807L18.4137 12.8574C19.061 12.469 19.061 11.5308 18.4137 11.1424L8.0416 4.9192Z"
                  />
                </svg>
                Watch trailer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Promotion from '../components/promotion';

export default function Hero() {
  const router = useRouter();
  const [promo, setPromo] = useState(false);
  useEffect(() => {
    const check = localStorage.getItem("promotion", "true");
    if (!check) {
      const timer = setTimeout(() => {
        setPromo(true);
      }, 3000)
      return () => clearTimeout(timer);
    }
  }, [])

return (
  <div className="relative pt-32 pb-12 bg-black sm:pt-40 lg:pt-48 xl:pt-60 sm:pb-16 lg:pb-32 xl:pb-48 2xl:pb-56">
    {/* Header */}
    <header className="absolute inset-x-0 top-0 z-10 py-6 sm:py-8 xl:py-12">
      <div className="px-4 mx-auto sm:px-6 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0">{/* logo goes here */}</div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 transition-all duration-200 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-10 lg:ml-28">
            <a href="/Abt" className="text-sm sm:text-base text-white transition">About</a>
            <a href="/login" className="text-sm sm:text-base text-white transition">Login</a>
            <a href="/dashboard" className="text-sm sm:text-base text-white transition">Dashboard</a>
            <a
              href="/register"
              className="px-4 py-2 text-sm sm:text-base border-2 border-primary rounded-full text-white hover:bg-white hover:text-black transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>

    {/* Background */}
    <div className="absolute inset-0">
      <div
        className="w-full h-full bg-cover bg-right"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=2072&q=80')",
          maskImage: "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-right"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=2072&q=80')",
          filter: "blur(8px)",
          maskImage: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1))",
          WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1))",
        }}
      />
    </div>

    {/* Hero section */}
    <div className="relative">
      <div className="px-4 mx-auto sm:px-6 lg:px-12 max-w-7xl">
        <div className="w-full lg:w-2/3 xl:w-1/2">
          <h1 className="text-sm sm:text-base font-normal text-white">Your Personal AI Health Tracker</h1>

          <p className="mt-4 sm:mt-6 text-white">
            <span className="block font-sans font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              HealthNudge - Wellness
            </span>
            <span className="block font-serif italic font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2">
              Enhanced by AI
            </span>
          </p>

          <p className="mt-6 sm:mt-10 text-lg sm:text-xl md:text-2xl text-white">
            Get personalized tips, diet plans, and report insights — built just for you.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="w-full sm:w-auto px-5 py-2 text-sm sm:text-base font-semibold bg-white text-black rounded-full hover:bg-opacity-90 transition text-center"
            >
              Get started
            </a>
            <a
              href="#"
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2 text-sm sm:text-base font-semibold border-2 border-primary rounded-full text-white hover:bg-white hover:text-black transition"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.0416 4.9192C7.37507 4.51928 6.5271 4.99939 6.5271 5.77669L6.5271 18.2232C6.5271 19.0005 7.37507 19.4806 8.0416 19.0807L18.4137 12.8574C19.061 12.469 19.061 11.5308 18.4137 11.1424L8.0416 4.9192Z" />
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

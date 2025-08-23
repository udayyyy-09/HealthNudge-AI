"use client";
import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger);

function Booking() {
  useGSAP(() => {
    gsap.set("#how-it-works svg path", {
      drawSVG: "0%",
    });

    gsap.to("#how-it-works svg path", {
      drawSVG: "100%",
      scrollTrigger: {
        trigger: "#how-it-works",
        start: "top 90%",
        end: "bottom 55%",
        scrub: 1,
      },
    });
  }, []);

  return (
    <section id="hitw" className="py-10 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl font-poppins">
            How HealthNudge Works? Take a look 
          </h2>
          <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600 font-inter">
            Getting professional services has never been easier. Book trusted
            professionals for all your home service needs in just three simple
            steps.
          </p>
        </div>

        <div id="how-it-works" className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden md:block md:px-12 lg:px-20 xl:px-32 top-2">
            <svg
              className="w-full"
              viewBox="0 0 800 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Adjusted path for 3 points */}
              <path
                d="M5 25 Q200 5 400 25 Q600 45 795 25"
                stroke="black"
                strokeWidth="2"
                strokeDasharray="8,8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-8">
            {/* Step 1 */}
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700 font-poppins">
                  1
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10 font-poppins">
                Register
              </h3>
              <p className="mt-4 text-base text-gray-600 font-inter">
                Create your HealthNudge account with secure authentication.
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700 font-poppins">
                  2
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10 font-poppins">
                Upload Report
              </h3>
              <p className="mt-4 text-base text-gray-600 font-inter">
                Upload your medical report (PDF/Image) safely for AI processing.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span className="text-xl font-semibold text-gray-700 font-poppins">
                  3
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10 font-poppins">
                Get Summary
              </h3>
              <p className="mt-4 text-base text-gray-600 font-inter">
                Instantly receive a simplified, AI-generated health summary with insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Booking;

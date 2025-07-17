"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    title: "Personalized Diet Plans",
    description: "Custom nutrition plans tailored to your body and goals.",
    image: "/images/diet.jpg",
  },
  {
    title: "AI-Generated Health Tips",
    description: "Get smart daily tips powered by AI for a healthier lifestyle.",
    image: "/images/tips.png",
  },
  {
    title: "Wellness Report Generator",
    description: "Generate detailed wellness reports in seconds.",
    image: "/images/report.jpg",
  },
  {
    title: "PDF Report Analysis",
    description: "Upload health reports & get insights using Gemini/LLM.",
    image: "/images/upload.jpg",
  },
  {
    title: "Progress Tracking",
    description: "Visual charts for weekly progress in diet & workouts.",
    image: "/images/progress.jpg",
  },
  {
    title: "Secure Authentication",
    description: "Safe login with cookies & email verification.",
    image: "/images/secure.jpg",
  },
];

export default function FeatureSlider() {
  const trackRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const track = trackRef.current;
    let offset = 0;

    const scroll = () => {
      if (track) {
        offset -= 0.7;
        if (offset <= -track.scrollWidth / 2) offset = 0;
        track.style.transform = `translateX(${offset}px)`;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  return (
    <section className="relative bg-white py-16 overflow-hidden">
      <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-700 mb-12">
         Key Features Of <span className  = "underline decoration-black/50 text-black">HealthNudge</span>
      </h2>

      <div className="overflow-hidden w-full relative px-4">
        <div ref={trackRef} className="flex space-x-8 w-max will-change-transform">
          {[...features, ...features].map((feature, index) => (
            <div
              key={index}
              className="w-[280px] sm:w-[320px] flex-shrink-0 bg-black/50 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4 text-white">
                <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

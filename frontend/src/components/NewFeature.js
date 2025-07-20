"use client";

import { useEffect, useRef, useState } from "react";

const cardData = [
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

const Card = ({ title, description, image }) => {
  return (
    <div className="mt-[45vh] p-8 max-w-md  bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl max-lg:mt-6 max-lg:p-4 max-lg:max-w-full">
       <img
        src={image}
        alt={title}
        className="w-full h-58 object-cover rounded-xl mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 max-lg:text-xl max-lg:mb-1 font-poppins">
        {title}
      </h2>
      <p className="text-lg text-gray-700 max-lg:text-base font-inter">
        {description}
      </p>
    </div>
  );
};


const FeatureSlider
 = () => {
  const [showVideo, setShowVideo] = useState(false);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShowVideo(true);
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
            }
          } else {
            setShowVideo(false);
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Video Background */}
      <div className={`fixed inset-0 z-[-1] transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover  "
        >
          <source src="/video/bgVideo2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <section 
        ref={sectionRef}
        className="my-6 sm:my-8 md:my-12 lg:my-16 xl:my-20 relative grid grid-cols-2 max-lg:my-3 max-lg:px-2 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:gap-4"
      >
        {/* Left Part */}
        <div className="h-fit w-fit sticky top-1/4 px-10 justify-self-center flex flex-col items-center justify-center text-8xl font-bold uppercase text-white border-l-4 border-white max-lg:static max-lg:border-l-0 max-lg:border-b-4 max-lg:text-3xl max-lg:w-full max-lg:py-3 max-lg:px-0">
          <span className="font-playfair">Features</span>
          <span className="font-playfair">We</span>
          <span className="font-playfair">Provide</span>
        </div>

        {/* Right Part */}
        <div className="max-lg:w-full max-lg:flex max-lg:justify-center">
          <div className="flex flex-wrap justify-center xl:justify-start max-lg:flex-col max-lg:items-center max-lg:gap-3">
            {cardData.map((card, index) => (
              <Card
                key={index}
                image = {card.image}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureSlider;
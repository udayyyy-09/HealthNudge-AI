"use client";
import React from "react";
import {
  FileText,
  Apple,
  BarChart3,
  ShieldCheck,
  Volume2,
  Cloud
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI-powered Health Management",
    description:
      "Secure upload of PDF/Image medical reports with OCR + text extraction to generate detailed summaries.",
  },
  {
    icon: Apple,
    title: "Personalized Diet Plans",
    description:
      "Tailored veg/non-veg diet recommendations based on medical report insights.",
  },
  {
    icon: BarChart3,
    title: "Dynamic Activity Dashboard",
    description:
      "Interactive dashboard to track health progress and recommendations in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Robust authentication using cookies and email verification with protected routes.",
  },
  {
    icon: Volume2,
    title: "Accessibility with TTS",
    description:
      "Listen to your medical reports and summaries with built-in Text-to-Speech for better usability.",
  },
  {
    icon: Cloud,
    title: "AI & Cloud Integrations",
    description:
      "Seamless integration with OpenAI, Tesseract.js, pdf-parse, and Google Cloud services.",
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl font-pj">
            Make every step user-centric
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-8 font-pj">
            Check how HealthNudge is different from others
          </p>
        </div>

        <div className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition"
            >
              <feature.icon className="mx-auto h-12 w-12 text-black" />
              <h3 className="mt-6 text-xl font-bold text-gray-900 font-pj">
                {feature.title}
              </h3>
              <p className="mt-4 text-base text-gray-600 font-pj">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-black mb-6">
              Ready to Transform Your Wellness?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who have already discovered the power of
              AI-driven wellness coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-4 text-lg rounded-3xl cursor-pointer hover:bg-gray-900 transition">
                Get Started Today
              </button>
              <button className="border border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg rounded-2xl cursor-pointer transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Features;

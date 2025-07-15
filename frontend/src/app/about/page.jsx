"use client";
// import { Button } from "@/Abouts/ui/button"
import { Brain, FileText, Lock, Smartphone, Utensils, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      

      {/* What is HealthNudge Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                What is HealthNudge?
              </h1>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Your personal AI health assistant
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-black">
                  Intelligent Health Guidance at Your Fingertips
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  HealthNudge is more than just an app – it's your dedicated AI
                  health companion that understands your unique wellness
                  journey. Our advanced artificial intelligence learns from your
                  habits, preferences, and health data to provide personalized
                  recommendations that actually work.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you're tracking daily habits, seeking nutrition
                  advice, or analyzing health reports, HealthNudge delivers
                  instant, actionable insights powered by cutting-edge AI
                  technology.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      AI-Powered Insights
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Personalized Experience
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <span className="text-gray-700 font-medium">
                      Privacy First
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-5"></div>
                  <div className="text-center z-10">
                    <img
                      src="images/healthquote.jpg"
                      alt=""
                      className="h-[600px] object-cover"
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-black border-opacity-10 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-black bg-opacity-5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black mb-4">See WellnessAI in Action</h2>
        <p className="text-xl text-gray-600">Discover how our AI transforms your wellness journey</p>
      </div>

      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <video
          src="/video/AIvideo.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          controls
        />
      </div>
    </div>
  </div>
</section>

      {/* Key Features Section */}
      

      {/* About Content Section */}
      {/* <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  We believe wellness should be accessible, intelligent, and personalized. Our AI-powered platform
                  transforms how you approach health and wellness.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  By combining cutting-edge artificial intelligence with user-friendly design, we create a seamless
                  experience that adapts to your unique lifestyle and goals.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-20 h-20 text-white mx-auto mb-4" />
                    <p className="text-lg font-medium">AI-Powered Wellness</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      
    </div>
  );
}

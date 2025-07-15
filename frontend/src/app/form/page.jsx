"use client";
import { useState } from "react";
import {
  Heart,
  Droplets,
  Utensils,
  Activity,
  Moon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useRouter } from 'next/navigation';
export default function Form() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sleepHours: "",
    waterIntake: "",
    meals: "",
    exercise: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/health/add`, formData,{
        withCredentials:true,
      });
      console.log("Response received: ", res.data);

      setSuccess(true);
      setFormData({
        sleepHours: "",
        waterIntake: "",
        meals: "",
        exercise: "",
      });
      if(res.status == 201){
            setSuccess("Form Submitted Successfully")
            router.push("/dashboard");
      }
    } catch (err) {
      console.error("Error: ", err);
      setError(err.response?.data?.message || "Error while submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Left Side - Form Content */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Health Tracker
                </h1>
                <p className="text-gray-600">
                  Track your daily wellness journey
                </p>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700">
                    Data submitted successfully!
                  </span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Moon className="w-4 h-4 mr-2 text-indigo-500" />
                      Sleep Hours
                    </label>
                    <input
                      type="number"
                      name="sleepHours"
                      value={formData.sleepHours}
                      onChange={handleChange}
                      placeholder="Enter hours (e.g., 7.5)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 hover:border-gray-400 text-gray-700"
                      min="0"
                      max="24"
                      step="0.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                      Water Intake (L)
                    </label>
                    <input
                      type="number"
                      name="waterIntake"
                      value={formData.waterIntake}
                      onChange={handleChange}
                      placeholder="Enter number of glasses"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 transition-all duration-200 hover:border-gray-400"
                      min="0"
                      max="20"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Utensils className="w-4 h-4 mr-2 text-green-500" />
                      Meals you took averagely
                    </label>
                    <select
                      name="meals"
                      value={formData.meals}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                      required
                    >
                      <option value="" className = "text-gray-700">-- Select Meal Type --</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="High Protein">Low Protein</option>
                      <option value="Low Carb">Low Carb</option>
                      <option value="Junk Food">Junk Food</option>
                      <option value="Skipped">Skipped</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Activity className="w-4 h-4 mr-2 text-red-500" />
                      Exercise
                    </label>
                    <select
                      name="exercise"
                      value={formData.exercise}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                      required
                    >
                      <option value="">-- Select Exercise Type</option>
                      <option value="Walking">Walking</option>
                      <option value="Running">Running</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Gym">Gym</option>
                      <option value="Cycling">Cycling</option>
                      <option value="Swimming">Swimming</option>
                      <option value="No Exercise">No Exercise</option>
                    </select>
                  </div>
                </div>

                <div
                  onClick={handleSubmit}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 cursor-pointer text-center ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105"
                  } text-white shadow-lg`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Track My Health"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Photo Container */}
          <div className="flex-1 relative overflow-hidden">
            {/* ✅ Background Image using Tailwind classes */}
            <div className="absolute inset-0 bg-[url('/images/quote.jpg')] bg-cover bg-center brightness-50"></div>

            {/* ✅ Overlay Content with semi-transparent gradient */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-opacity-80">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Why this form?</h2>
                <p className="text-lg opacity-90 mb-6">
                  Log your daily habits, get personalized insights, and take
                  control of your wellness
                </p>

                {/* Benefits List */}
                <ul className="text-left list-disc list-inside text-white text-base mb-6 space-y-4 mt-6">
                  <li>Get personalized diet plans based on your habits</li>
                  <li>Receive daily AI-powered health tips</li>
                  <li>Track your wellness progress and view weekly reports</li>
                </ul>

                {/* Footer Info */}
                <div className="flex space-x-8 justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm opacity-75">Tracking</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm opacity-75">Secure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">∞</div>
                    <div className="text-sm opacity-75">Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

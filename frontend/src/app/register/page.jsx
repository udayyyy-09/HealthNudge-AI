"use client";
import { useState } from "react";
import axios from "axios";
import {
  Target,
  FileText,
  Calendar,
  Heart,
  ChevronRight,
  Check,
} from "lucide-react";

export default function HealthNudgeSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    goal: "weight loss",
    dietType: "vegetarian",
  });
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to Terms & Conditions");
      return;
    }
    setVerify(false);
    setLoading(true);
    setError("");

    //get response from backend
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
        formData
      );
      console.log(response.data);
      if (response.status === 201) {
        setVerify(true);
      }
    } catch (err) {
      console.log("Error while registering:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-800 flex items-center justify-center p-4 py-12">
  {verify ? (
    <div className="max-w-2xl w-full text-center bg-[#efebe0] p-8 rounded-xl shadow">
      <p className="text-green-600 text-2xl font-semibold">
        ✅ Registration complete! Please check your inbox and tap the verification link to get started. We can't wait to welcome you aboard! 🚀
      </p>
    </div>

  ) : (
    <div className="container mx-auto">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
            <p className="text-gray-600">
              Join thousands improving their health
            </p>
          </div>

          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Age */}
            <div>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Goal */}
            <div>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="weight loss">Lose Weight</option>
                <option value="muscle gain">Gain Muscle</option>
                <option value="general wellness">General Wellness</option>
              </select>
            </div>

            {/* Diet Type */}
            <div>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center transition-all ${
                    agreed ? "bg-blue-500 border-blue-500" : "border-gray-400"
                  }`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer"
              >
                I agree to{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Terms & Conditions
                </a>{" "}
                on HealthNudge
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>
                    {loading ? "Creating Account..." : "Create Account"}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                className="text-blue-500 hover:underline font-semibold"
              >
                Login
              </a>
            </p>
          </div>
        </form>

        {/* Right side - Image space */}
        <div className="hidden lg:flex justify-center">
          <div className="w-[500px] h-full max-w-md">
            <img
              src="/images/quote.jpg"
              alt="Health and wellness"
              className="rounded-xl w-[500px] h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        // setError("Successfully login");
        console.log("Logged In", response.data);
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
        
      }
    } catch (err) {
      console.log("Error while login", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {success ? (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <img src="/images/Skateboarding.gif" alt="Loading..." className="w-32 h-32 mb-6" />
        <p className="text-lg font-semibold text-gray-600">Hold Tight, redirecting to dashboard</p>
      </div>
    ) : (
      <div className="w-full h-screen grid lg:grid-cols-2 ">
          {/* Left side - Form */}
          <div className="flex items-center justify-center lg:p-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg w-full max-w-md"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Login to your account</h2>
                <p className="text-gray-600 text-sm">
                  Join thousands improving their health
                </p>
              </div>

              {error && (
                <div className="text-red-500 mb-4 text-center">{error}</div>
              )}

              <div className="space-y-5">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 text-lg"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>{loading ? "Logging in..." : "Login"}</span>
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Right side - Full height image */}
          <div className="hidden lg:block">
            <img
              src="/images/login.jpg"
              alt="Health and wellness"
              className="w-full h-screen object-cover"
            />
          </div>
        </div>
    )}
      
      </div>
  );
}
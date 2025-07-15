"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");              //token for verification 

      if (!token) {
        setMessage("Invalid or missing token.");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-email?token=${token}`
        );
        if (response.status === 200) {
          setMessage("✅ Email verified successfully. Redirecting to login...");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      } catch (err) {
        console.error(err);
        setMessage("Verification failed. The token might be invalid or expired.");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efebe0] px-4">
      <div className="max-w-md p-8 border rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold text-green-500">{message}</h2>
      </div>
    </div>
  );
}

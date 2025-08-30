import VerifyEmailContent from "./../../components/verifyContent";
import { Suspense } from "react";
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efebe0] px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
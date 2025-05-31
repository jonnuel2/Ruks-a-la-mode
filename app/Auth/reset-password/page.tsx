"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      router.push("/Auth/forgot-password");
    } else {
      setValidToken(true);
    }
  }, [token, router]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password reset successful!");
        router.push("/Auth/login");
      } else {
        toast.error(data.message || "Reset failed.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[70vh]">
        <ToastContainer />
        <h2 className="text-3xl font-bold mb-10">VERIFYING TOKEN...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh]">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-10">RESET PASSWORD</h2>

      <form onSubmit={handleReset} className="flex flex-col items-center w-full">
        <input
          type="password"
          placeholder="Enter new password"
          className="px-3 py-1.5 text-[#0e0e0e] text-xs bg-transparent border border-dark outline-none rounded-md lg:w-72 w-72 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 lg:w-72 w-40 p-3 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black/85 hover:opacity-70 cursor-pointer"
          } rounded-md flex items-center font-medium justify-center`}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-[#f5f5f5] lg:text-sm text-xs uppercase">RESET</span>
          )}
        </button>
      </form>
    </div>
  );
}

export const dynamic = 'force-dynamic';
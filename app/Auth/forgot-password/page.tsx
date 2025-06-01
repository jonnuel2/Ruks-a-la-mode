"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetEmail = async (resetLink: string) => {
    if (!email) {
      toast.error("Recipient email address is empty.");
      return;
    }

    const templateParams = {
      to_email: email,
      subject: "Password Reset Request",
      message: `You have requested to reset your password. Click the link below to proceed: ${resetLink}`,
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAIL_JS_PASSWORD_RESET_TEMPLATE_ID ?? "",
        templateParams,
        {publicKey:process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY}
      );
      toast.success("Reset link sent to your email. Please check your inbox.");
      setEmail(""); // Clear the email input after sending
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Send email with the reset link
        await sendResetEmail(result.resetLink);
      } else {
        toast.error(result.message || "Failed to process forgot password request.");
      }
    } catch (error) {
      console.error("Error during forgot password request:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh]">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-10">FORGOT PASSWORD</h2>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-3 py-1.5 text-[#0e0e0e] text-xs bg-transparent border border-dark outline-none rounded-md lg:w-72 w-72 mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
            <span className="text-[#f5f5f5] lg:text-sm text-xs uppercase">SEND LINK</span>
          )}
        </button>
      </form>

      <div className="mt-6">
        <Link href="/Auth/login">
          <div className="flex items-center justify-center border border-dark/60 px-3 py-1.5 rounded-md cursor-pointer">
            <p className="text-xs font-bold text-dark whitespace-nowrap">
              Remembered your password? <span className="text-blue-600">Login</span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

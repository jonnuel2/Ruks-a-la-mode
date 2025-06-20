"use client";

import { Suspense, useEffect, useState } from "react";
import { useAppContext } from "@/helpers/store";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/helpers/api-controller";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[70vh]">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  const { setuser } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get redirect parameter if it exists
  const redirectParam = searchParams?.get("redirect");

  // Handle redirects and check for existing authentication
  useEffect(() => {
    const existingUser = localStorage.getItem("user");
    const existingToken = localStorage.getItem("token");

    // Store redirect parameter if it exists
    if (redirectParam) {
      localStorage.setItem("postLoginRedirect", redirectParam);
      console.log("Login page: Stored redirect URL:", redirectParam);
    }

    // If user is already logged in, redirect them
    if (existingUser && existingToken) {
      const redirectTo = localStorage.getItem("postLoginRedirect") || "/";
      localStorage.removeItem("postLoginRedirect");
      router.push(redirectTo);
    }
  }, [redirectParam, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);

      if (response.success && response.user) {
        // Store authentication data
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setuser(response.user);

        toast.success("Login successful!");

        // Get the redirect destination
        const redirectTo = localStorage.getItem("postLoginRedirect") || "/";
        console.log("Login successful, redirecting to:", redirectTo);

        // Clear the stored redirect
        localStorage.removeItem("postLoginRedirect");

        // Redirect to the stored destination
        setTimeout(() => {
          router.push(redirectTo);
        }, 800);
      } else {
        toast.error(response.message || "Login failed.");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage =
        error?.response?.data?.message || "An error occurred during login.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh]">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-10">LOGIN TO CONTINUE</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center w-full"
      >
        <input
          type="email"
          placeholder="Email"
          className="px-3 py-1.5 text-[#0e0e0e] text-xs bg-transparent border border-dark outline-none rounded-md lg:w-72 w-72 mb-6"
          value={loginInfo.email}
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, email: e.target.value })
          }
          required
        />

        <div className="flex px-3 py-1.5 text-[#0e0e0e] mb-2 items-center rounded-md justify-center space-x-2 lg:w-72 w-72 bg-transparent border border-dark">
          <input
            type={hidden ? "password" : "text"}
            placeholder="Password"
            className="bg-transparent outline-none text-xs w-full"
            value={loginInfo.password}
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setHidden(!hidden)}
            className="lg:text-xs text-[10px] text-blue-600"
          >
            {hidden ? "SHOW" : "HIDE"}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="w-full flex justify-end lg:w-72 pr-20 sm:pr-0 mb-6">
          <Link
            href="/Auth/forgot-password"
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 lg:w-72 w-40 p-3 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black/85 hover:opacity-70 cursor-pointer"
          } rounded-md flex items-center font-medium justify-center`}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-[#f5f5f5] lg:text-sm text-xs uppercase">
              LOGIN
            </span>
          )}
        </button>
      </form>

      <div className="mt-6">
        <Link
          href={`/Auth/signup${
            redirectParam ? `?redirect=${redirectParam}` : ""
          }`}
        >
          <div className="flex items-center justify-start cursor-pointer">
            <p className="text-xs font-bold text-dark whitespace-nowrap">
              Don&apos;t have an account?{" "}
              <span className="text-blue-600">Create account</span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

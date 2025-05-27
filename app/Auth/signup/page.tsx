"use client";

import { useState, useEffect } from "react";
import { signup } from "@/helpers/api-controller";
import { useAppContext } from "@/helpers/store";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [signupInfo, setSignupInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  const context = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setuser } = context;

  // Get redirect URL from query parameters or fallback to "/"
  const redirectUrl = searchParams?.get("redirect") || "/";

  // Store redirect URL in state to preserve it
  const [redirectTo, setRedirectTo] = useState(redirectUrl);

  // Update redirectTo if the URL parameter changes
  useEffect(() => {
    if (redirectUrl) {
      setRedirectTo(redirectUrl);
      console.log("Redirect URL set to:", redirectUrl);
    }
  }, [redirectUrl]);

  // Handle signup button click
  const handleSignUp = async () => {
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = signupInfo;

    // Basic client-side validations
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending signup request...");
      const response = await signup(firstName, lastName, email, phoneNumber, password, confirmPassword);
      console.log("Signup response:", response);

      if (response && response.success === true) {
        const userData = {
          id: response.user?.id || response.userId || "unknown",
          firstName: response.user?.firstName || firstName,
          lastName: response.user?.lastName || lastName,
          email: response.user?.email || email,
          phoneNumber: response.user?.phoneNumber || phoneNumber,
        };

        console.log("Saving user data:", userData);

        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        localStorage.setItem("user", JSON.stringify(userData));
        setuser(userData);

        toast.success("Signup successful! Redirecting...");

        // Wait a bit to ensure state is saved before redirect
        setTimeout(() => {
          console.log("Redirecting to:", redirectTo);
          router.push(redirectTo || "/");
        }, 800);
      } else {
        console.error("Unexpected response:", response);
        toast.error(response?.message || "Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast.error(error.response?.data?.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "px-3 py-1.5 text-[#0e0e0e] text-xs bg-transparent border border-dark outline-none rounded-md lg:w-72 w-72 mb-6";

  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh]">
      <p className="text-3xl font-bold mb-12">SIGN UP TO CONTINUE</p>

      <input
        placeholder="First Name"
        className={inputStyle}
        value={signupInfo.firstName}
        onChange={(e) => setSignupInfo({ ...signupInfo, firstName: e.target.value })}
      />

      <input
        placeholder="Last Name"
        className={inputStyle}
        value={signupInfo.lastName}
        onChange={(e) => setSignupInfo({ ...signupInfo, lastName: e.target.value })}
      />

      <input
        placeholder="Email"
        className={inputStyle}
        value={signupInfo.email}
        onChange={(e) => setSignupInfo({ ...signupInfo, email: e.target.value })}
        type="email"
      />

      <input
        placeholder="Phone Number"
        className={inputStyle}
        value={signupInfo.phoneNumber}
        onChange={(e) => setSignupInfo({ ...signupInfo, phoneNumber: e.target.value })}
        type="number"
      />

      <div className="flex px-3 py-1.5 text-[#0e0e0e] items-center rounded-md justify-center space-x-2 lg:w-72 w-72 mb-6 bg-transparent border border-dark">
        <input
          className="bg-transparent outline-none text-xs w-full"
          placeholder="Password"
          value={signupInfo.password}
          onChange={(e) => setSignupInfo({ ...signupInfo, password: e.target.value })}
          type={hidden ? "password" : "text"}
        />
        <p onClick={() => setHidden(!hidden)} className="lg:text-xs text-[10px] cursor-pointer select-none">
          {hidden ? "SHOW" : "HIDE"}
        </p>
      </div>

      <input
        placeholder="Confirm Password"
        className={inputStyle}
        value={signupInfo.confirmPassword}
        onChange={(e) => setSignupInfo({ ...signupInfo, confirmPassword: e.target.value })}
        type={hidden ? "password" : "text"}
      />

      <div
        onClick={() => {
          if (!loading) handleSignUp();
        }}
        className={`mt-2 lg:w-72 w-40 p-3 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black/85 hover:opacity-70 cursor-pointer"
        } rounded-md flex items-center font-medium justify-center`}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <p className="text-[#f5f5f5] lg:text-sm text-xs uppercase">SIGN UP</p>
        )}
      </div>

      <div className="mt-4">
        <Link href="/Auth/login">
          <div className="flex items-center justify-center border border-dark/60 px-3 py-1.5 rounded-md cursor-pointer">
            <p className="text-xs font-bold text-dark whitespace-nowrap">
              Already have an account? <span className="text-blue-600">Login</span>
            </p>
          </div>
        </Link>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
    </div>
  );
}

"use client";

import { useState } from "react";
import { signup } from "@/helpers/api-controller";
import { useAppContext } from "@/helpers/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify"; // ✅ import Toastify
import 'react-toastify/dist/ReactToastify.css'; // ✅ import default styles

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  [key: string]: any;
}

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
  const { setuser } = context;

  const handleSignUp = async () => {
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = signupInfo;

    if (!firstName || !lastName ||  !email || !phoneNumber || !password || !confirmPassword) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending request to signup API...");
      const response = await signup(firstName, lastName, email, phoneNumber, password, confirmPassword);
      console.log("Received response:", response);

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setuser(response.user);

        toast.success("Signup successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500); // Give the toast some time to show before redirect
      } else {
        toast.error(response.message || "Signup failed. Please try again.");
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
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, firstName: e.target.value })
        }
      />

      <input
        placeholder="Last Name"
        className={inputStyle}
        value={signupInfo.lastName}
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, lastName: e.target.value })
        }
      />

      <input
        placeholder="Email"
        className={inputStyle}
        value={signupInfo.email}
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, email: e.target.value })
        }
        type="email"
      />

      <input
        placeholder="Phone Number"
        className={inputStyle}
        value={signupInfo.phoneNumber}
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, phoneNumber: e.target.value })
        }
        type="number"
      />

      

      <div className="flex px-3 py-1.5 text-[#0e0e0e] items-center rounded-md justify-center space-x-2 lg:w-72 w-72 mb-6 bg-transparent border border-dark">
        <input
          className="bg-transparent outline-none text-xs w-full"
          placeholder="Password"
          value={signupInfo.password}
          onChange={(e) =>
            setSignupInfo({ ...signupInfo, password: e.target.value })
          }
          type={hidden ? "password" : "text"}
        />
        <p
          onClick={() => setHidden(!hidden)}
          className="lg:text-xs text-[10px]"
        >
          {hidden ? "SHOW" : "HIDE"}
        </p>
      </div>

      <input
        placeholder="Confirm Password"
        className={inputStyle}
        value={signupInfo.confirmPassword}
        onChange={(e) =>
          setSignupInfo({ ...signupInfo, confirmPassword: e.target.value })
        }
        type={hidden ? "password" : "text"}
      />

      <div
        onClick={() => {
          if (!loading) handleSignUp();
        }}
        className={`mt-2 lg:w-72 w-40 p-3 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black/85 hover:opacity-70 cursor-pointer"
        } rounded-md flex items-center font-medium justify-center`}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <p className="text-[#f5f5f5] lg:text-sm text-xs uppercase">SIGN UP</p>
        )}
      </div>

      {/* Login Link */}
      <div className="mt-4">
        <Link href="/auth/login">
          <div className="flex items-center justify-center border border-dark/60 px-3 py-1.5 rounded-md cursor-pointer">
            <p className="text-xs font-bold text-dark whitespace-nowrap">
              Already have an account?{" "}
              <span className="text-blue-600">Login</span>
            </p>
          </div>
        </Link>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
    </div>
  );
}

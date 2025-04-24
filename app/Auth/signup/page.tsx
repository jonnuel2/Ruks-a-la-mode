"use client";

import { useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/helpers/utils/auth";
import { useAppContext } from "@/helpers/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const [signupInfo, setSignupInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  const context = useAppContext();
  const router = useRouter();
  const { setuser } = context;

  onAuthStateChanged(auth, (u) => {
    if (u) {
      setuser(u);
    }
  });

  const handleSignUp = () => {
    const { firstName, lastName, email, password, confirmPassword } =
      signupInfo;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/roaming/admin");
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
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
        <Link href="login">
          <div className="flex items-center justify-center border border-dark/60 px-3 py-1.5 rounded-md cursor-pointer">
            <p className="text-xs font-bold text-dark whitespace-nowrap">
              Already have an account?{" "}
              <span className="text-blue-600">Login</span>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

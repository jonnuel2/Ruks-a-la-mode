"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/helpers/utils/auth";
import { useAppContext } from "@/helpers/store";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const context = useAppContext();
  const router = useRouter();
  const { setuser } = context;
  const [hidden, sethidden] = useState(true);

  // Auth check on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setuser(u);
        router.push("/roaming/admin");
      }
    });

    return () => unsubscribe();
  }, []);

  const isValidPassword = (password: string) => {
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return password.length >= minLength && hasLetter && hasNumber;
  };

  const handleSignIn = () => {
    setLoading(true);

    const { email, password } = loginInfo;

    if (!email || !password) {
      toast.error("Incomplete login credentials");
      setLoading(false);
      return;
    } else {
      toast.success("logging in...");
      setLoading(true);
    }

    if (!isValidPassword(password)) {
      toast.error(
        "Password must be at least 6 characters long and include letters and numbers."
      );
      setLoading(false);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/roaming/admin");
      })
      .catch((reason) => {
        toast.error("Incorrect email or password");
        console.error(reason.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <ToastContainer />
      <p className="text-3xl font-bold mb-20">RUKS Á LA MODE</p>
      <p className="text-lg font-semibold mb-12">LOGIN TO CONTINUE</p>
      <input
        placeholder="Email"
        className="px-3 py-1.5 text-[#0e0e0e] lg:w-72 w-72 text-xs bg-transparent border border-dark outline-none rounded-md"
        value={loginInfo.email}
        onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
        type="email"
      />
      <div className="flex mt-8 px-3 py-1.5 text-[#0e0e0e] mb-12 items-center rounded-md justify-center space-x-2 lg:w-72 w-72 bg-transparent border border-dark">
        <input
          className="bg-transparent outline-none text-xs w-full"
          placeholder="Password"
          value={loginInfo.password}
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, password: e.target.value })
          }
          type={hidden ? "password" : "text"}
        />
        <p
          onClick={() => sethidden(!hidden)}
          className="lg:text-xs text-[10px] cursor-pointer"
        >
          {hidden ? "SHOW" : "HIDE"}
        </p>
      </div>
      <div
        onClick={() => {
          if (!loading) handleSignIn();
        }}
        className={`mt-2 lg:w-72 w-40 p-3 ${
          loading ? "bg-gray-600" : "bg-black/85 hover:opacity-90"
        } rounded-md flex items-center font-medium justify-center ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {loading ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <p className="text-[#f5f5f5] lg:text-sm text-xs uppercase">LOGIN</p>
        )}
      </div>
    </div>
  );
}

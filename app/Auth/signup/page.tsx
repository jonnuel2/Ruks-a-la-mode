"use client";

import { useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/helpers/utils/auth";
import { useAppContext } from "@/helpers/store";
import { useRouter } from "next/navigation";
import { Radio } from "react-loader-spinner";

export default function Page() {
  const [signupInfo, setSignupInfo] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const context = useAppContext();
  const router = useRouter();

  const { setuser } = context;

  onAuthStateChanged(auth, (u) => {
    if (u) {
      setuser(u);
      // router.push("/roaming/admin");
    }
  });

  const handleSignUp = () => {
    setLoading(true);
    if (!signupInfo.email || !signupInfo.password) {
      alert("Incomplete Signup");
      setLoading(false);
      return;
    }
    const { email, password } = signupInfo;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/roaming/admin");
      })
      .catch((reason) => alert(reason.message))
      .finally(() => setLoading(false));
  };

  const [hidden, setHidden] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh]">
      <p className="text-3xl font-bold mb-20">SIGN UP TO CONTINUE</p>
      {/* <p className="text-lg font-semibold mb-12">SIGN UP TO CONTINUE</p> */}
      <input
        placeholder="Email"
        className="px-3 py-1.5 text-[#0e0e0e] lg:w-72 w-72 text-xs bg-transparent border border-dark outline-none rounded-md"
        value={signupInfo.email}
        onChange={(e) => setSignupInfo({ ...signupInfo, email: e.target.value })}
        type="email"
      />
      <div className="flex mt-8 px-3 py-1.5 text-[#0e0e0e] mb-12 items-center rounded-md justify-center space-x-2 lg:w-72 w-72 bg-transparent border border-dark">
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
      <div
        onClick={handleSignUp}
        className={`mt-2 lg:w-72 w-40 p-3 bg-black/85 rounded-md flex items-center font-medium justify-center hover:opacity-70 cursor-pointer`}
      >
        {loading ? (
          <Radio />
        ) : (
          <p className="text-[#f5f5f5] lg:text-sm text-xs uppercase">SIGN UP</p>
        )}
      </div>
    </div>
  );
}

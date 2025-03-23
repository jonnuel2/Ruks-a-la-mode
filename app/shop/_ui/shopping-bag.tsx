"use client";

import { usePathname } from "next/navigation";
import { useAppContext } from "@/helpers/store";
import Link from "next/link";
import { useEffect } from "react";

export default function ShoppingBag() {
  const context = useAppContext();
  const pathname = usePathname();

  const { cart, setcart } = context;

  // Retrieve items from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        console.log(JSON.parse(storedCart));
        setcart(JSON.parse(storedCart));
      }
    }
  }, []);
  return (
    <Link href="/shop/cart">
      {pathname === "/merch/cart" ? (
        <></>
      ) : (
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="#1B1B1B"
            className="lg:size-6 size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          {cart?.items?.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
              {cart?.items?.length}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ShoppingBag from "../shop/_ui/shopping-bag";
import { useAppContext } from "@/helpers/store";

export default function Header() {
  const routes = ["home", "shop", "contact-us"];
  const paths = ["/", "/shop", "/contact-us"];
  const pathname = usePathname();

  const [open, setopen] = useState(false);
  const [search, setsearch] = useState({
    isOpen: false,
    keyword: "",
  });

  const context = useAppContext();
  const router = useRouter();

  const { currencies, currency, setCurrency } = context;

 // Fixed useEffect with client-side check
 useEffect(() => {
  if (typeof window !== 'undefined') {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency && currencies.includes(savedCurrency)) {
      setCurrency(savedCurrency);
    }
  }
}, [currencies, setCurrency]);


  // Fixed handleCurrencyChange with client-side check
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedCurrency", selectedCurrency);
    }
  };

  const handleSearch = () => {
    if (search?.keyword !== "") {
      router.push(`/shop?search=${search.keyword}`);
    }
  };

  return (
    <>
      {paths.some(
        (path) => pathname.startsWith(path) && !pathname.startsWith("/roaming")
      ) && (
        <div className="relative">
          <div className="w-full flex items-center justify-between pb-8 lg:pt-8 pt-6 px-3 lg:px-10">
            {/* logo */}
            <div className="lg:w-2/5 items-center justify-start flex lg:ml-0">
              <Link href="/" className="">
                <p className="uppercase font-bold text-coffee text-xs lg:text-2xl tracking-wider">
                  RUKS Á LA MODE
                </p>
              </Link>
            </div>

            {/* nav-menu */}
            <div className="flex items-center gap-2 justify-center lg:justify-end">
              {/* nav items */}
              <div className="md:flex items-center justify-center space-x-10 hidden mr-12">
                {routes.map((r) => (
                  <Link key={r} href={r === "home" ? "/" : `/${r}`}>
                    <div className="cursor-pointer hover:bg-[#fea203] hover:bg-opacity-30">
                      <p className="uppercase text-dark text-xs lg:text-sm tracking-wider cursor-pointer">
                        {r.replace("-", " ")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {/* search - desktop */}
              <div
                className={`
                  hidden md:flex items-center
                  transition-all duration-300 ease-in-out
                  ${search.isOpen ? "bg-white border border-gray-900 rounded-full" : ""}
                `}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`
                    text-sm outline-none
                    transition-all duration-300 ease-in-out
                    rounded-full
                    ${search.isOpen ? "w-64 px-4 py-2 opacity-100" : "w-0 px-0 opacity-0"}
                  `}
                  value={search.keyword}
                  onChange={(e) => setsearch({ ...search, keyword: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className={`
                    size-4 lg:size-6 cursor-pointer
                    transition-all duration-300 ease-in-out
                    ${search.isOpen ? "mr-3" : "lg:mr-4 mr-2"}
                  `}
                  onClick={() => setsearch({ ...search, isOpen: !search.isOpen })}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              {/* search - mobile */}
              <div className="md:hidden flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-4 mr-2 cursor-pointer"
                  onClick={() => setsearch({ ...search, isOpen: !search.isOpen })}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              {/* cart */}
              <ShoppingBag />
              {/* currency */}
              <select
                className="bg-transparent cursor-pointer lg:text-sm text-xs lg:ml-4 ml-2 lg:border border lg:border-dark border-dark/60 outline-none appearance-none"
                style={{ WebkitAppearance: 'menulist' }}
                // onChange={(e) => setCurrency(e.target.value)}
                onChange={handleCurrencyChange}
                value={currency}
                name="currency"
              >
                {currencies?.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            {paths.some(
              (path) =>
                pathname.startsWith(path) && !pathname.startsWith("/roaming")
            ) && (
              <div className="md:hidden flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#0e0e0e"
                  className="size-6"
                  onClick={() => setopen(!open)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
            )}
          </div>
          {/* mobile menu */}
          {open && (
            <div className="absolute flex flex-col items-start space-y-2 px-4 pb-4 bg-[#f5f5f5] w-full z-50 shadow-md">
              {routes.map((r) => (
                <Link
                  href={r === "home" ? "/" : `/${r}`}
                  onClick={() => setopen(false)}
                  key={r}
                >
                  <p className="uppercase font-bold text-gray-900">
                    {r.replace("-", " ")}
                  </p>
                </Link>
              ))}
            </div>
          )}
          {/* mobile search */}
          <div
            className={`
              md:hidden absolute w-full z-10 bg-white border-t flex items-center border-gray-200
              transition-all duration-300 ease-in-out overflow-hidden
              ${search.isOpen ? "h-14" : "h-0"}
            `}
          >
            <div className="px-3 py-2 flex items-center justify-between w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-sm outline-none"
                value={search.keyword}
                onChange={(e) => setsearch({ ...search, keyword: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 cursor-pointer"
                onClick={handleSearch}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />a
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
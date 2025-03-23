"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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

  const handleSearch = () => {
    search?.keyword !== ""
      ? router.push(`/shop?search=${search.keyword}`)
      : null;
    setsearch({ ...search, isOpen: !search.isOpen });
  };
  return (
    <>
      {paths.some(
        (path) => pathname.startsWith(path) && !pathname.startsWith("/roaming")
      ) && (
        <div className="relative ">
          <div className="w-full flex items-center justify-between pb-8 lg:pt-8 pt-6 px-3 lg:px-10">
            <div className="lg:w-2/5 items-center justify-start flex lg:ml-0">
              <Link href="/" className="">
                <p className="uppercase lg:font-bold font-black text-coffee text-xs lg:text-2xl tracking-wider">
                  RUKS Á LA MODE
                </p>
              </Link>
            </div>
            <div className=" flex items-center justify-center lg:justify-end">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-4 lg:size-6 lg:mr-4 mr-2 cursor-pointer"
                onClick={() => setsearch({ ...search, isOpen: !search.isOpen })}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>

              <ShoppingBag />
              <select
                className="bg-transparent cursor-pointer lg:text-sm text-xs lg:ml-4 ml-2 lg:border border lg:border-dark border-dark/60 outline-none"
                onChange={(e) => setCurrency(e.target.value)}
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
          {open && (
            <div className="absolute flex flex-col items-start space-y-2 px-4 pb-4 bg-[#f5f5f5] w-full z-50">
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
          <div
            className={`bg-lightgrey w-72 absolute right-0 transition-[height] ease-in-out duration-200 z-50 ${
              search.isOpen ? " h-12 -bottom-12" : "h-0"
            }`}
          >
            <input
              value={search.keyword}
              onChange={(e) =>
                setsearch({ ...search, keyword: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission if inside a form
                  handleSearch();
                }
              }}
              type="text"
              placeholder="Search for your favorite products"
              className={`bg-transparent px-2 py-1 text-xs w-full outline-none ${
                search.isOpen ? " h-12 border border-dark" : "h-0 hidden"
              }`}
            />
          </div>
        </div>
      )}
    </>
  );
}

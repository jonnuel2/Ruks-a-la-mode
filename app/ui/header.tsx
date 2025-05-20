"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import ShoppingBag from "../shop/_ui/shopping-bag"
import { useAppContext } from "@/helpers/store"

export default function Header() {
  const routes = ["home", "about-us", "shop", "contact-us", "faqs"]
  const paths = ["/", "/about-us", "/shop", "/contact-us", "/faqs"]
  const pathname = usePathname()

  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState({
    isOpen: false,
    keyword: "",
  })

  const context = useAppContext()
  const router = useRouter()
  const { currencies, currency, setCurrency } = context

  const [user, setUser] = useState<{ name?: string; email: string } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("selectedCurrency")
      const storedUser = localStorage.getItem("user")
      if (savedCurrency && currencies.includes(savedCurrency)) {
        setCurrency(savedCurrency)
      }
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (err) {
          console.error("Invalid user JSON in localStorage")
        }
      } else {
        // Clear user if no user in localStorage
        setUser(null)
      }
    }
  }, [currencies, setCurrency, pathname])

  // Add this effect after the existing useEffect
  useEffect(() => {
    // Function to handle storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        if (e.newValue) {
          try {
            const parsedUser = JSON.parse(e.newValue)
            setUser(parsedUser)
          } catch (err) {
            console.error("Invalid user JSON in localStorage")
          }
        } else {
          setUser(null)
        }
      }
    }

    // Add event listener
    window.addEventListener("storage", handleStorageChange)

    // Clean upz
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = e.target.value
    setCurrency(selectedCurrency)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCurrency", selectedCurrency)
    }
  }

  const handleSearch = () => {
    if (search?.keyword !== "") {
      router.push(`/shop?search=${search.keyword}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
    window.location.reload()
  }

  return (
    <>
      {paths.some((path) => pathname.startsWith(path) && !pathname.startsWith("/roaming")) && (
        <div className="relative">
          <div className="w-full flex items-center justify-between pb-8 lg:pt-8 pt-6 px-3 lg:px-10">
            {/* Hamburger icon for mobile */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setOpen(!open)} className="text-dark focus:outline-none" aria-label="Toggle Menu">
                {open ? (
                  // Close icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* logo */}
            <div className="lg:w-2/5 items-center justify-start flex lg:ml-0">
              <Link href="/">
                <p className="uppercase font-bold text-coffee text-xs lg:text-2xl tracking-wider whitespace-nowrap">
                  RUKS Á LA MODE
                </p>
              </Link>
            </div>

            {/* nav-menu and auth */}
            <div className="flex items-center gap-2 justify-center lg:justify-end">
              {/* nav */}
              <div className="md:flex items-center justify-center space-x-10 hidden mr-12">
                {routes.map((r) => (
                  <Link key={r} href={r === "home" ? "/" : `/${r}`}>
                    <div className="cursor-pointer hover:bg-[#fea203] hover:bg-opacity-30">
                      <p className="uppercase text-dark text-xs lg:text-sm tracking-wider cursor-pointer whitespace-nowrap">
                        {r.replace("-", " ")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* search */}
              <div
                className={`hidden md:flex items-center transition-all duration-300 ease-in-out ${
                  search.isOpen ? "bg-white border border-gray-900 rounded-full" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`text-sm outline-none transition-all duration-300 ease-in-out rounded-full ${
                    search.isOpen ? "w-64 px-4 py-2 opacity-100" : "w-0 px-0 opacity-0"
                  }`}
                  value={search.keyword}
                  onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSearch()
                    }
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className={`size-4 lg:size-6 cursor-pointer transition-all duration-300 ease-in-out ${
                    search.isOpen ? "mr-3" : "lg:mr-4 mr-2"
                  }`}
                  onClick={() => setSearch({ ...search, isOpen: !search.isOpen })}
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
                  onClick={() => setSearch({ ...search, isOpen: !search.isOpen })}
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

              {/* auth dropdown */}
              {user ? (
                <div className="relative">
                  <div
                    className="flex items-center justify-center lg:ml-4 ml-2 cursor-pointer"
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  {dropdownVisible && (
                    <div className="absolute flex flex-col bg-white border border-gray-200 rounded-md top-8 right-0 shadow-md z-50 w-52 p-3">
                      <div className="mb-2 border-b pb-2">
                        <p className="text-sm font-semibold text-dark">
                          {user.firstName || "No Name"} {user.lastName || ""}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-left text-dark hover:bg-gray-100 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/Auth/login">
                    <div className="hidden md:flex items-center justify-center lg:ml-4 ml-2 py-1.5 rounded-md cursor-pointer">
                      <p className="text-xs font-medium text-dark whitespace-nowrap">LOGIN /</p>
                    </div>
                    <div className="flex md:hidden items-center justify-center lg:ml-4 ml-2 py-1.5 border px-2 rounded-md cursor-pointer">
                      <p className="text-xs font-medium text-dark whitespace-nowrap">LOGIN</p>
                    </div>
                  </Link>
                  <Link href="/Auth/signup">
                    <div className="hidden md:flex items-center justify-center lg:border border lg:border-dark border-dark/60 px-3 py-1.5 rounded-md cursor-pointer">
                      <p className="text-xs font-bold text-dark whitespace-nowrap">Sign Up</p>
                    </div>
                  </Link>
                </>
              )}

              {/* currency */}
              <select
                className="bg-transparent cursor-pointer lg:text-sm text-xs lg:ml-4 ml-2 lg:border border lg:border-dark border-dark/60 outline-none appearance-none"
                style={{ WebkitAppearance: "menulist" }}
                onChange={handleCurrencyChange}
                value={currency}
                name="currency"
              >
                {currencies?.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* mobile nav */}
          {open && (
            <div className="absolute flex flex-col items-start space-y-2 px-4 pb-4 bg-[#f5f5f5] w-full z-50 shadow-md">
              {routes.map((r) => (
                <Link href={r === "home" ? "/" : `/${r}`} onClick={() => setOpen(false)} key={r}>
                  <p className="uppercase font-bold text-gray-900">{r.replace("-", " ")}</p>
                </Link>
              ))}
            </div>
          )}

          {/* mobile search */}
          <div
            className={`md:hidden absolute w-full z-10 bg-white border-t flex items-center border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
              search.isOpen ? "h-14" : "h-0"
            }`}
          >
            <div className="px-3 py-2 flex items-center justify-between w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full text-sm outline-none"
                value={search.keyword}
                onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSearch()
                  }
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="size-4 cursor-pointer"
                onClick={() => setSearch({ ...search, isOpen: !search.isOpen })}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

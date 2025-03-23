"use client";
import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

const Sidebar = ({
  setActiveView,
  activeView,
  menuItems,
  logout,
  role,
}: {
  setActiveView: (view: string) => void;
  activeView: string;
  menuItems: any[];
  logout: () => void;
  role: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed lg:block hidden">
      <div className="p-4 font-bold border-b border-gray-700">
        <Link href="/">
          <p>RUKS Á LA MODE</p>
        </Link>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          {menuItems
            ?.filter((m: any) => m?.roles?.includes(role))
            .map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => setActiveView(item.key)}
                  className={`w-full text-left flex items-center px-4 py-2 text-xs ${
                    activeView === item.key
                      ? "bg-gray-900"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          <li key="logout">
            <button
              onClick={() => logout()}
              className={`w-full text-left flex items-center px-4 py-2 text-xs text-red-600 `}
            >
              <span className="mr-2">
                <FaExclamationTriangle />
              </span>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

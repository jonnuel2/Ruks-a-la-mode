"use client";

import { useEffect, useState } from "react";
import Orders from "./_ui/_orders";
import MainArea from "./_ui/main-area";
import Sidebar from "./_ui/sidebar";
import Products from "./_ui/_products";
import Payments from "./_ui/_payments";
import Deliveries from "./_ui/_deliveries";
import Administrators from "./_ui/_administrators";
import Content from "./_ui/_content";
import Analytics from "./_ui/_analytics";
import Users from "./_ui/_users";
import Inventory from "./_ui/_inventory";
import {
  FaTshirt,
  FaShoppingCart,
  FaUsers,
  FaTruck,
  FaMoneyBill,
  FaCogs,
  FaImages,
} from "react-icons/fa";
import { useAppContext } from "@/helpers/store";
import { useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import { auth, logout } from "@/helpers/utils/auth";
import { FaSquarePollVertical } from "react-icons/fa6";
import DiscountCodes from "./_ui/_discount-codes";
import { onAuthStateChanged } from "firebase/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAdmins, updateLastSeen } from "@/helpers/api-controller";

export default function Page() {
  const [activeView, setActiveView] = useState("");

  const [open, setopen] = useState(false);

  const router = useRouter();
  const context = useAppContext();

  const {
    data: adminsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdmins(),
  });

  const admins = adminsData?.admins;

  const { user, setuser } = context;

  const [role, setrole] = useState("");

  const lastSeenMutation = useMutation({
    mutationFn: (email: string) => updateLastSeen(email),
  });

  const menuItems = [
    {
      key: "analytics",
      label: "Analytics",
      icon: <FaSquarePollVertical />,
      roles: ["super"],
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: <FaUsers />,
      roles: ["super", "inventory"],
    },
    {
      key: "orders",
      label: "Orders",
      icon: <FaShoppingCart />,
      roles: ["super", "production"],
    },
    {
      key: "products",
      label: "Products",
      icon: <FaTshirt />,
      roles: ["super"],
    },
    // { key: "payments", label: "Payments", icon: <FaMoneyBill /> },
    {
      key: "deliveries",
      label: "Deliveries",
      icon: <FaTruck />,
      roles: ["super", "deliveries"],
    },
    {
      key: "discount-codes",
      label: "Discount Codes",
      icon: <FaTruck />,
      roles: ["super"],
    },
    {
      key: "administrators",
      label: "Administrators",
      icon: <FaCogs />,
      roles: ["super"],
    },
    {
      key: "users",
      label: "Users",
      icon: <FaUsers />,
      roles: ["super"],
    },
    {
      key: "content",
      label: "Content",
      icon: <FaImages />,
      roles: ["super"],
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "analytics":
        return <Analytics />;
      //
      case "orders":
        return <Orders />;
      //
      case "products":
        return <Products />;
      // case "payments":
      //   return <Payments />;
      case "deliveries":
        return <Deliveries />;
      //
      case "discount-codes":
        return <DiscountCodes />;
      //
      case "administrators":
        return <Administrators />;
      //
      case "users":
        return <Users />;
      //
      case "content":
        return <Content />;
      //
      case "inventory":
        return <Inventory />;

      default:
        // return <div>Select a view</div>;
        return <Analytics />;
    }
  };

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/roaming/login");
  //   } else {
  //     let current = admins?.find((a: any) => a?.id === user?.email);
  //     setrole(current?.data?.role);
  //     lastSeenMutation.mutate(user?.email);
  //   }
  // }, [user]);

  useEffect(() => {
  if (!user) {
    router.push("/roaming/login");
  } else {
    const current = admins?.find((a: any) => a?.id === user?.email);
    const userRole = current?.data?.role;
    setrole(userRole);
    lastSeenMutation.mutate(user?.email);

    // Set default view based on role
    if (userRole === "production") {
      setActiveView("orders");
    } else if (userRole === "deliveries") {
      setActiveView("deliveries");
    } else {
      setActiveView("analytics"); // Default for super/admin
    }
  }
}, [user, admins]);


  return (
    <div className="flex lg:flex-row flex-col overflow-x-auto">
      {/* Mobile Menu Button and Dropdown */}
      <div className="lg:hidden bg-white mb-8 flex flex-col items-start relative">
        {/* Hamburger Menu Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#0e0e0e"
          className="size-12 lg:hidden block cursor-pointer p-2 w-10 h-10"
          onClick={() => setopen(!open)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>

        {/* Dropdown Menu */}
        {open && (
          <div className="flex absolute z-50 left-0 right-0 top-full bg-white flex-col items-start space-y-4 mt-0 px-6 py-4 shadow-xl border-t border-gray-200 cursor-pointer">
            {menuItems
              ?.filter((m: any) => m?.roles?.includes(role))
              .map((m) => (
                <div
                  key={m?.label}
                  className="w-full py-2 hover:bg-gray-50 px-2 rounded"
                  onClick={() => {
                    setActiveView(m.key);
                    setopen(false);
                  }}
                >
                  <p className="uppercase font-bold text-gray-900">{m.label}</p>
                </div>
              ))}
            <div
              className="w-full py-2 hover:bg-gray-50 px-2 rounded"
              onClick={() => {
                logout();
                setuser(undefined);
                setopen(false);
              }}
            >
              <p className="uppercase font-bold text-gray-900">LOGOUT</p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          menuItems={menuItems}
          logout={() => {
            setrole("");
            logout();
            setuser(undefined);
          }}
          role={role}
        />
      </div>

      {/* Main Content Area */}
      <MainArea>{renderView()}</MainArea>
    </div>
  );
}

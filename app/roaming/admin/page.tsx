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
    { key: "content", label: "Content", icon: <FaImages />, roles: ["super"] },
    {
      key: "analytics",
      label: "Analytics",
      icon: <FaSquarePollVertical />,
      roles: ["super"],
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "orders":
        return <Orders />;
      case "products":
        return <Products />;
      // case "payments":
      //   return <Payments />;
      case "deliveries":
        return <Deliveries />;
      case "discount-codes":
        return <DiscountCodes />;
      case "administrators":
        return <Administrators />;
      case "content":
        return <Content />;
      case "analytics":
        return <Analytics />;
      default:
        return <div>Select a view</div>;
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/roaming/login");
    } else {
      let current = admins?.find((a: any) => a?.id === user?.email);
      setrole(current?.data?.role);
      lastSeenMutation.mutate(user?.email);
    }
  }, [user]);

  return (
    <div className="flex lg:flex-row flex-col">
      <div className="lg:hidden mb-8 flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#0e0e0e"
          className="size-6 lg:hidden block"
          onClick={() => setopen(!open)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        {open && (
          <div className="flex flex-col items-center space-y-2 mt-2">
            {menuItems
              ?.filter((m: any) => m?.roles?.includes(role))
              .map((m) => (
                <div
                  key={m?.label}
                  onClick={() => {
                    setActiveView(m.key);
                    setopen(false);
                  }}
                >
                  <p className="uppercase font-bold text-gray-900">{m.label}</p>
                </div>
              ))}
            <div
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
      <MainArea>{renderView()}</MainArea>
    </div>
  );
}

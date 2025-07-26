"use client";

import { useAppContext } from "@/helpers/store";
import Image from "next/image";
import Incrementer from "@/app/ui/incrementer";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/helpers/functions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProduct } from "@/helpers/api-controller";

// Define types for better TypeScript support
interface CartItem {
  item: {
    id: string;
    name: string;
    price: number;
    priceInUsd?: number;
    originalPrice: number;
    image: string;
    stock?: number;
    measurement: any;
    color: { name: string; hexCode: string; stock?: number };
    weight?: number;
    selectedPart?: { name: string };
    selectedMaterial?: { name: string };
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

export default function Page() {
  const context = useAppContext();
  const router = useRouter();
  const { cart, setcart, currency, exchangeRates } = context;
  const [stockStatus, setStockStatus] = useState<{ [key: string]: { inStock: boolean; availableStock: number; totalQuantity: number } }>({});

  const getMeasurementString = (measurement: any) => {
    if (!measurement) return null;

    const entries = measurement.custom
      ? Object.entries(measurement.custom)
      : Object.entries(measurement).filter(([key]) => key !== "custom");

    if (entries.length === 0) return null;

    return (
      <div className="flex flex-col">
        {entries.map(([key, value]) => (
          <p key={key} className="font-medium tracking-wide text-xs">
            {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
          </p>
        ))}
      </div>
    );
  };

  // Fetch and update stock status whenever cart changes
  useEffect(() => {
    const checkStockStatus = async () => {
      const status: { [key: string]: { inStock: boolean; availableStock: number; totalQuantity: number } } = {};
      if (cart?.items?.length > 0) {
        const groupedItems = cart.items.reduce((groups: { [key: string]: number }, item) => {
          const key = `${item.item.id}-${item.item.color.name}`;
          groups[key] = (groups[key] || 0) + item.quantity;
          return groups;
        }, {});

        for (const [key, totalQuantity] of Object.entries(groupedItems)) {
          try {
            const [productId] = key.split("-");
            const productData = await getProduct(productId);
            const product = productData?.product;
            const colorName = cart.items.find((item) => `${item.item.id}-${item.item.color.name}` === key)?.item.color.name || "";
            const color = product?.data?.colors?.find(
              (c: any) => c.name.trim().toLowerCase() === colorName.trim().toLowerCase()
            );
            const availableStock = color?.stock ?? (product?.data?.stock ?? 0);
            const isInStock = availableStock >= totalQuantity;
            status[key] = { inStock: isInStock, availableStock, totalQuantity };
            if (!isInStock && availableStock > 0) {
              toast.warn(
                `Insufficient stock for ${product?.data?.name} (${colorName}): Total ${totalQuantity} items, only ${availableStock} available`,
                {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light",
                }
              );
            }
          } catch (error) {
            console.error(`Error fetching stock for ${key}:`, error);
            status[key] = { inStock: false, availableStock: 0, totalQuantity };
            toast.error(`Unable to verify stock for ${key}. Please try again.`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
          }
        }
      }
      setStockStatus(status);
    };

    checkStockStatus();
  }, [cart]); // Changed dependency to full cart object

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setcart(JSON.parse(storedCart));
      }
    }
  }, [setcart]);

  const viewProduct = (id: string) => {
    router.push(`/shop/${id}`);
  };

  const handleDeleteItem = (index: number, itemName: string) => {
    const newItems = [...cart.items];
    newItems.splice(index, 1);
    const updatedCart = { ...cart, items: newItems };

    setcart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("Cart after deletion:", updatedCart);

    toast.success(`"${itemName}" removed from cart`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handleCheckout = async (e: React.MouseEvent) => {
    // Prevent checkout if button is disabled
    if ((e.target as HTMLElement).closest(".bg-gray-300")) {
      return;
    }

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Re-validate stock before checkout
    let hasOutOfStock = false;
    const groupedItems = cart?.items?.reduce((groups: { [key: string]: number }, item) => {
      const key = `${item.item.id}-${item.item.color.name}`;
      groups[key] = (groups[key] || 0) + item.quantity;
      return groups;
    }, {});

    for (const [key, totalQuantity] of Object.entries(groupedItems)) {
      try {
        const [productId] = key.split("-");
        const productData = await getProduct(productId);
        const product = productData?.product;
        const colorName = cart.items.find((item) => `${item.item.id}-${item.item.color.name}` === key)?.item.color.name || "";
        const color = product?.data?.colors?.find(
          (c: any) => c.name.trim().toLowerCase() === colorName.trim().toLowerCase()
        );
        const availableStock = color?.stock ?? (product?.data?.stock ?? 0);
        if (availableStock < totalQuantity) {
          hasOutOfStock = true;
          toast.error(
            `Insufficient stock for ${product?.data?.name} (${colorName}): Total ${totalQuantity} items, only ${availableStock} available`,
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            }
          );
          console.log(`Blocking checkout: ${product?.data?.name} (${colorName}) - Total Quantity: ${totalQuantity}, Stock: ${availableStock}`);
        }
      } catch (error) {
        console.error(`Error validating stock for ${key}:`, error);
        hasOutOfStock = true;
        toast.error("Unable to verify stock. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        break;
      }
    }

    if (hasOutOfStock) {
      return;
    }

    if (!token || !user) {
      localStorage.setItem("postLoginRedirect", "/shop/cart/checkout");
      router.push(`/Auth/login?redirect=${encodeURIComponent("/shop/cart/checkout")}`);
    } else {
      router.push("/shop/cart/checkout");
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {cart?.items?.length > 0 ? (
        <div className="w-full items-center flex flex-col">
          <div className="w-full lg:w-[94%] flex items-center lg:items-end justify-between mt-4 lg:mt-12">
            <p className="lg:text-4xl text-2xl font-medium tracking-wide">
              Your Bag
            </p>
            <Link href="/shop" className="text-xs lg:mt-0 mt-2 underline">
              Continue Shopping
            </Link>
          </div>
          <div className="container lg:mt-16 mt-8">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b-[0.5px] border-dark/20">
                  <tr className="items-start flex w-full justify-between">
                    <th className="px-4 py-2 text-left text-xs font-extralight lg:w-1/2">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left ml-16 text-xs lg:block hidden font-extralight w-[30%]">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-extralight lg:w-1/5">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-extralight lg:w-1/12"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.items?.map((c: CartItem, i: number) => {
                    const key = `${c.item.id}-${c.item.color.name}`;
                    const stockInfo = stockStatus[key] || { inStock: true, availableStock: c?.item?.stock || c?.item?.color?.stock || 0, totalQuantity: c.quantity };
                    return (
                      <tr
                        className="border-b items-start flex w-full justify-between"
                        key={`${c?.item?.id}-${i}`}
                      >
                        <td className="px-4 my-5 flex lg:flex-row flex-col items-start w-[46.8%]">
                          {c?.item?.image && (
                            <Image
                              priority
                              width={120}
                              height={280}
                              src={c.item.image || "/placeholder.svg"}
                              alt="Product Image"
                              className="mr-4"
                            />
                          )}
                          <div className="flex flex-col items-start space-y-1">
                            <span
                              onClick={() => viewProduct(c?.item?.id)}
                              className="lg:text-sm font-semibold text-blue text-xs lg:mt-0 mt-3 capitalize cursor-pointer hover:underline"
                            >
                              {c?.item?.name}
                            </span>
                            <div className="flex flex-col">
                              <p className="font-medium tracking-wide text-xs">
                                Color: {c?.item?.color?.name || c?.color?.name}
                              </p>
                              {getMeasurementString(c?.item?.measurement)}
                              <p className="font-medium tracking-wide text-xs mt-1">
                                Weight:{" "}
                                <span className="font-medium">
                                  {c?.item?.weight
                                    ? `${(c.item.weight * c.quantity).toFixed(1)} kg`
                                    : "N/A"}
                                </span>
                              </p>
                              <p className="font-medium tracking-wide text-xs mt-1">
                                Quantity:{" "}
                                <span className="font-medium">{c?.quantity}</span>
                              </p>
                              {!stockInfo.inStock && stockInfo.availableStock > 0 && (
                                <p className="font-medium tracking-wide text-xs mt-1 text-red-600">
                                  Only {stockInfo.availableStock} available (Total: {stockInfo.totalQuantity})
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 lg:w-40 w-16 p-1 lg:p-2 border-dark/70 border lg:hidden block">
                            <Incrementer
                              leftClick={() => {
                                const modifiedCart = { ...cart };
                                if (modifiedCart.items[i].quantity > 1) {
                                  modifiedCart.items[i].quantity -= 1;
                                } else {
                                  const newItems = modifiedCart.items.filter(
                                    (ci) => ci.item.id !== c.item.id || ci.item.color.name !== c.item.color.name
                                  );
                                  modifiedCart.items = newItems;
                                }
                                setcart(modifiedCart);
                                localStorage.setItem("cart", JSON.stringify(modifiedCart));
                              }}
                              rightClick={() => {
                                const stockInfo = stockStatus[key] || { availableStock: c?.item?.stock || c?.item?.color?.stock || 0 };
                                if (c.quantity < stockInfo.availableStock) {
                                  const modifiedCart = { ...cart };
                                  modifiedCart.items[i].quantity += 1;
                                  setcart(modifiedCart);
                                  localStorage.setItem("cart", JSON.stringify(modifiedCart));
                                } else {
                                  toast.error(
                                    `Only ${stockInfo.availableStock} items available for ${c.item.name} (${c.item.color.name})`,
                                    {
                                      position: "top-right",
                                      autoClose: 3000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                      theme: "light",
                                    }
                                  );
                                }
                              }}
                              value={c?.quantity}
                            />
                          </div>
                        </td>
                        <td className="px-4 lg:w-[30%] lg:block hidden">
                          <div className="flex items-start">
                            <div className="mt-4 lg:w-40 w-16 p-1 lg:p-2 border-dark/70 border">
                              <Incrementer
                                leftClick={() => {
                                  const modifiedCart = { ...cart };
                                  if (modifiedCart.items[i].quantity > 1) {
                                    modifiedCart.items[i].quantity -= 1;
                                  } else {
                                    modifiedCart.items.splice(i, 1);
                                  }
                                  setcart(modifiedCart);
                                  localStorage.setItem("cart", JSON.stringify(modifiedCart));
                                }}
                                rightClick={() => {
                                  const stockInfo = stockStatus[key] || { availableStock: c?.item?.stock || c?.item?.color?.stock || 0 };
                                  if (c.quantity < stockInfo.availableStock) {
                                    const modifiedCart = { ...cart };
                                    modifiedCart.items[i].quantity += 1;
                                    setcart(modifiedCart);
                                    localStorage.setItem("cart", JSON.stringify(modifiedCart));
                                  } else {
                                    toast.error(
                                      `Only ${stockInfo.availableStock} items available for ${c.item.name} (${c.item.color.name})`,
                                      {
                                        position: "top-right",
                                        autoClose: 3000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        theme: "light",
                                      }
                                    );
                                  }
                                }}
                                value={c?.quantity}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 mt-3 font-light text-xs lg:text-sm lg:w-1/5">
                          {formatPrice(
                            currency,
                            currency === "NGN"
                              ? c.item?.originalPrice * c.quantity
                              : (c.item?.priceInUsd ||
                                  c.item?.originalPrice * exchangeRates["usd"]) *
                                c.quantity
                          )}
                        </td>
                        <td className="px-4 mt-3 font-light text-xs lg:text-sm lg:w-1/12">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-800 hover:text-gray-600 cursor-pointer transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            onClick={() => handleDeleteItem(i, c.item.name)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="self-end flex flex-col items-end mt-10 lg:mr-10">
            <div className="p-5 rounded-sm">
              <span className="flex items-center justify-end lg:space-x-3 space-x-1">
                <p className="font-medium lg:text-xs text-[10px] text-dark">
                  Estimated Total
                </p>
                <p className="font-light text-dark lg:text-xs text-[10px]">
                  {formatPrice(
                    currency,
                    cart?.items?.reduce(
                      (sum: any, item: any) =>
                        (currency === "NGN"
                          ? item.item?.originalPrice * item.quantity
                          : (item.item?.priceInUsd ||
                              item.item?.originalPrice * exchangeRates["usd"]) *
                            item.quantity) + sum,
                      0
                    )
                  )}
                </p>
              </span>
              <p className="lg:text-xs text-[10px] mt-2 text-dark text-right">
                *Taxes, discounts and shipping calculated at checkout
              </p>
            </div>
            <div
              onClick={handleCheckout}
              className={`mt-2 lg:w-96 w-40 p-3 flex items-center font-medium justify-center ${
                cart?.items?.some((item: CartItem) => {
                  const key = `${item.item.id}-${item.item.color.name}`;
                  const stockInfo = stockStatus[key] || { inStock: true, availableStock: item?.item?.stock || item?.item?.color?.stock || 0, totalQuantity: item.quantity };
                  return !stockInfo.inStock || item.quantity > stockInfo.availableStock;
                })
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black/85 hover:opacity-70 cursor-pointer"
              }`}
            >
              <p className="text-[#f5f5f5] lg:text-sm text-xs uppercase">
                {cart?.items?.some((item: CartItem) => {
                  const key = `${item.item.id}-${item.item.color.name}`;
                  const stockInfo = stockStatus[key] || { inStock: true, availableStock: item?.item?.stock || item?.item?.color?.stock || 0, totalQuantity: item.quantity };
                  return !stockInfo.inStock || item.quantity > stockInfo.availableStock;
                })
                  ? "Cannot Check Out"
                  : "Check Out"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <p className="lg:text-4xl text-lg font-semibold text-center tracking-widest">
            No Items In Your Shopping Bag
          </p>
          <div
            onClick={() => router.push("/shop")}
            className="mt-10 w-64 p-3 border-dark border flex items-center justify-center hover:bg-dark/10 cursor-pointer"
          >
            <p>View All Products</p>
          </div>
        </div>
      )}
    </div>
  );
}
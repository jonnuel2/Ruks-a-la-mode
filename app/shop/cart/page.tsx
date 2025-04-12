"use client";

import { useAppContext } from "@/helpers/store";
import Image from "next/image";
import Incrementer from "@/app/ui/incrementer";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/helpers/functions";
import Link from "next/link";
import { useEffect } from "react";
import { FaDeleteLeft, FaX } from "react-icons/fa6";
import { AiOutlineDelete, AiOutlineDeleteColumn } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const context = useAppContext();
  const router = useRouter();

  const { cart, setcart, currency, exchangeRates } = context;

  const getMeasurementString = (measurement: any) => {
    if (!measurement) return null;

    // Handle both standard measurements (size/length) and custom measurements
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

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setcart(JSON.parse(storedCart));
      }
    }
  }, []);

  const viewProduct = (id: string) => {
    router.push(`/shop/${id}`);
  };

// delete items
  const handleDeleteItem = (index: number, itemName: string) => {
    const newItems = [...cart.items];
    newItems.splice(index, 1);
    const updatedCart = { ...cart, items: newItems };
    
    setcart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    toast.success(`"${itemName}" removed from cart`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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
                  {cart?.items?.map((c: any, i: number) => (
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
                            src={c.item.image}
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
                                  ? `${(c.item.weight * c.quantity).toFixed(
                                      1
                                    )} kg`
                                  : "N/A"}
                              </span>
                            </p>
                            <p className="font-medium tracking-wide text-xs mt-1">
                              Quantity:{" "}
                              <span className="font-medium">{c?.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 lg:w-40 w-16 p-1 lg:p-2 border-dark/70 border lg:hidden block">
                          <Incrementer
                            leftClick={() => {
                              const modifiedCart = { ...cart };
                              if (c.quantity > 1) {
                                modifiedCart.items[i].quantity -= 1;
                                setcart(modifiedCart);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(modifiedCart)
                                );
                              } else {
                                const newItems = cart.items.filter(
                                  (ci: any) => c.item.name !== ci.item.name
                                );
                                const updatedCart = {
                                  ...cart,
                                  items: newItems,
                                };
                                setcart(updatedCart);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(updatedCart)
                                );
                              }
                            }}
                            rightClick={() => {
                              const modifiedCart = { ...cart };
                              if (
                                !c?.item?.stock ||
                                c?.quantity < c?.item?.stock
                              ) {
                                modifiedCart.items[i].quantity += 1;
                                setcart(modifiedCart);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(modifiedCart)
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
                            {/* <Incrementer
                              leftClick={() => {
                                const modifiedCart = { ...cart };
                                if (c.quantity > 1) {
                                  modifiedCart.items[i].quantity -= 1;
                                  setcart(modifiedCart);
                                  localStorage.setItem(
                                    "cart",
                                    JSON.stringify(modifiedCart)
                                  );
                                } else {
                                  const newItems = cart.items.filter(
                                    (ci: any) => c.item.name !== ci.item.name
                                  );
                                  const updatedCart = { ...cart, items: newItems };
                                  setcart(updatedCart);
                                  localStorage.setItem(
                                    "cart",
                                    JSON.stringify(updatedCart)
                                  );
                                }
                              }}
                              rightClick={() => {
                                const modifiedCart = { ...cart };
                                if (!c?.item?.stock || c?.quantity < c?.item?.stock) {
                                  modifiedCart.items[i].quantity += 1;
                                  setcart(modifiedCart);
                                  localStorage.setItem(
                                    "cart",
                                    JSON.stringify(modifiedCart)
                                  );
                                }
                              }}
                              value={c?.quantity}
                            /> */}

                            <Incrementer
                              leftClick={() => {
                                const modifiedCart = { ...cart };
                                if (modifiedCart.items[i].quantity > 1) {
                                  modifiedCart.items[i].quantity -= 1;
                                } else {
                                  modifiedCart.items.splice(i, 1); // Remove just this specific item
                                }
                                setcart(modifiedCart);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(modifiedCart)
                                );
                              }}
                              rightClick={() => {
                                const modifiedCart = { ...cart };
                                if (
                                  !c?.item?.stock ||
                                  c?.quantity < c?.item?.stock
                                ) {
                                  modifiedCart.items[i].quantity += 1;
                                }
                                setcart(modifiedCart);
                                localStorage.setItem(
                                  "cart",
                                  JSON.stringify(modifiedCart)
                                );
                              }}
                              value={c?.quantity}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 mt-3 font-light text-xs lg:text-sm lg:w-1/5">
                        {formatPrice(
                          currency,
                          c.item?.price *
                            exchangeRates[currency.toLowerCase()] *
                            c.quantity
                        )}
                      </td>
                      <td className="px-4 mt-3 font-light text-xs lg:text-sm lg:w-1/12">
                        {/* <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={() => {
                            const newItems = cart.items.filter(
                              (ci: any) => c.item.name !== ci.item.name
                            );
                            const updatedCart = { ...cart, items: newItems };
                            setcart(updatedCart);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(updatedCart)
                            );
                          }}
                        /> */}

                        {/* <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={() => {
                            // Create a new array without this specific item instance
                            const newItems = [...cart.items];
                            newItems.splice(i, 1); // Remove just this specific item at index i

                            const updatedCart = { ...cart, items: newItems };
                            setcart(updatedCart);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify(updatedCart)
                            );
                          }}
                        /> */}

                        {/* delete icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-800 hover:text-gray-600 cursor-pointer transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          onClick={() => handleDeleteItem(i, c.item.name)}
                          // onClick={() => {
                          //   // Create a new array without this specific item instance
                          //   const newItems = [...cart.items];
                          //   newItems.splice(i, 1); // Remove just this specific item at index i

                          //   const updatedCart = { ...cart, items: newItems };
                          //   setcart(updatedCart);
                          //   localStorage.setItem(
                          //     "cart",
                          //     JSON.stringify(updatedCart)
                          //   );
                          // }}
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
                  ))}
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
                        item.item?.price * item.quantity + sum,
                      0
                    ) * exchangeRates[currency.toLowerCase()]
                  )}
                </p>
              </span>
              <p className="lg:text-xs text-[10px] mt-2 text-dark text-right">
                *Taxes, discounts and shipping calculated at checkout
              </p>
            </div>
            <div
              onClick={() => router.push("cart/checkout")}
              className="mt-2 lg:w-96 w-40 p-3 bg-black/85 flex items-center font-medium justify-center hover:opacity-70 cursor-pointer"
            >
              <p className="text-[#f5f5f5] lg:text-sm text-xs uppercase">
                Check out
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

"use client";

import { getDiscount } from "@/helpers/api-controller";
import { formatPrice } from "@/helpers/functions";
import { useAppContext } from "@/helpers/store";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutBox({
  currency,
  rate,
  discount,
  setDiscount,
  shippingFee,
  price,
  deliveryType,
}: {
  currency: string;
  rate: number;
  discount: number;
  setDiscount: (value: number) => void;
  shippingFee: number | undefined; // This should be in Naira
  price: number;
  deliveryType: "standard" | "express";
}) {
  const [code, setcode] = useState("");
  const context = useAppContext();
  const { cart, setcart } = context;

  // Calculate prices based on currency and manual USD price if available
  const subtotal = cart?.items?.reduce((sum, item) => {
    const itemPrice =
      currency === "NGN"
        ? item.item.originalPrice || item.item.price
        : item.item.priceInUsd ||
          (item.item.originalPrice || item.item.price) * rate;
    return itemPrice * item.quantity + sum;
  }, 0);

  const discountAmount = (discount / 100) * subtotal;
  const discountedSubtotal = subtotal - discountAmount;
  const vat = 0.075 * discountedSubtotal;

  // Convert shipping fee to USD if currency is USD
  const displayShippingFee =
    currency === "NGN" ? shippingFee ?? 0 : (shippingFee ?? 0) * rate;

  const total = discountedSubtotal + vat + displayShippingFee;

  const handleSetDiscount = (data: any) => {
    setcart({ ...cart, discount: code });
    setDiscount(data?.discount);

    toast.success(`"${data?.discount}%" Discount Added`, {
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

  const getDiscountMutation = useMutation({
    mutationFn: () => getDiscount(code),
    onSuccess: (data) =>
      data?.hasOwnProperty("discount")
        ? handleSetDiscount(data)
        : toast.error(`"${data?.message}"`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }),
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setcart(JSON.parse(storedCart));
      }
    }
  }, []);

  return (
    <div className="p-3 border border-dark lg:w-[46%] w-full lg:mb-0 mb-16">
      <ToastContainer />
      <div className="w-full lg:p-8 p-2">
        {cart?.items?.map((c) => {
          const formattedMeasurementString = Object.entries(
            c?.item?.measurement
          )
            .map(
              ([key, value]) =>
                `${key.charAt(0).toUpperCase() + key.slice(1)}-${value}`
            )
            .join(", ");

          // Calculate item price based on currency
          // const itemPrice =
          //   currency === "NGN"
          //     ? c.item.originalPrice || c.item.price
          //     : c.item.priceInUsd ||
          //       (c.item.originalPrice || c.item.price) * rate;
          // Define a default NGN price
          const ngnPrice = c.item.originalPrice ?? c.item.price ?? 0;

          // Fallback exchange rates (as of mid-2024, you should update these periodically)
          const fallbackRates: { [key: string]: number } = {
            usd: 1480,
            gbp: 1850,
            eur: 1650,
            cad: 1100,
          };

          // Get the effective rate: from API or fallback
          const effectiveRate =
            rate ?? fallbackRates[currency.toLowerCase()] ?? 1;

          // Final item price calculation
          const itemPrice =
            currency === "NGN"
              ? ngnPrice
              : c.item.priceInUsd ?? ngnPrice * effectiveRate;

          return (
            <div
              className="flex lg:flex-row flex-col lg:items-center items-start lg:justify-between w-full lg:mb-2 mb-3"
              key={c?.item?.id}
            >
              <div className="flex items-center w-full justify-start">
                {c?.item.image && (
                  <Image
                    priority
                    width={100}
                    height={150}
                    src={c?.item.image}
                    alt="Product Image"
                    className="mr-4"
                  />
                )}
                <div>
                  <p className="tracking-wide lg:text-base text-sm font-medium lg:font-bold uppercase">
                    {c?.item?.name}
                  </p>
                  <p className="font-extralight tracking-wide text-[9px]">
                    {formattedMeasurementString}
                  </p>
                  <p className="font-extralight tracking-wide text-[9px]">
                    Color - {c?.item?.color?.name}
                  </p>
                  <p className="font-medium tracking-wide text-xs mt-1">
                    Weight:{" "}
                    <span className="font-semibold">
                      {c?.item?.weight
                        ? `${c?.item?.weight * c?.quantity} kg`
                        : "N/A"}
                    </span>
                  </p>
                  <p className="font-medium tracking-wide text-xs mt-1">
                    Quantity:{" "}
                    <span className="font-semibold">{c?.quantity}</span>
                  </p>
                </div>
              </div>
              <p className="lg:text-base text-sm lg:mt-0 mt-4">
                {formatPrice(currency, itemPrice * c?.quantity)}
              </p>
            </div>
          );
        })}

       {discount > 0 ? (
          <p className="font-medium text-xs tracking-wider text-green-500">
            {discount}% discount added
          </p>
        ) : (
          <div className="w-full flex items-center justify-between mt-8">
            <input
              className="w-3/4 border border-dark bg-transparent text-xs outline-none p-1 lg:h-11 h-9"
              type="text"
              placeholder="Coupon or Discount Code"
              id="discountCode"
              name="discountCode"
              value={code}
              onChange={(e) => setcode(e.target.value)}
            />
            <div
              onClick={() => (code ? getDiscountMutation.mutate() : null)}
              className="p-2 lg:h-11 h-9 bg-dark border border-dark w-28 flex items-center justify-center cursor-pointer hover:opacity-80"
            >
              <p className="text-[#F5f5f5] uppercase text-xs">Apply</p>
            </div>
          </div>
        )}

        <div className={`flex items-center justify-between w-full ${
            discount > 0 ? "mt-4" : "mt-8"
          }`}>
          <p className="font-medium tracking-wide lg:text-base text-xs">
            Subtotal
          </p>
          <p className="font-light tracking-wide lg:text-base text-xs">
            {formatPrice(currency, subtotal)}
          </p>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between w-full mt-2">
            <p className="font-medium tracking-wide lg:text-base text-xs">
              Discount
            </p>
            <p className="font-light tracking-wide lg:text-base text-xs text-red-500">
              -{formatPrice(currency, discountAmount)}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between w-full mt-2">
          <p className="font-medium tracking-wide lg:text-base text-xs">
            VAT (7.5%)
          </p>
          <p className="font-light tracking-wide lg:text-base text-xs">
            {formatPrice(currency, vat)}
          </p>
        </div>

        <div className="flex items-center justify-between w-full mt-8">
          <p className="font-medium tracking-wide lg:text-base text-xs">
            Delivery Type
          </p>
          <p className="font-light tracking-wide lg:text-base text-xs">
            {deliveryType
              ? deliveryType.charAt(0).toUpperCase() + deliveryType.slice(1)
              : "Not specified"}
          </p>
        </div>

        <div className="flex items-center justify-between w-full mt-2">
          <p className="font-medium tracking-wide lg:text-base text-xs">
            Shipping Fee
          </p>
          <p className="font-light tracking-wide lg:text-base text-xs">
            {formatPrice(currency, displayShippingFee)}
          </p>
        </div>

        {/* <div className="flex items-center justify-between w-full mt-3">
          <p className="font-semibold tracking-wide lg:text-lg text-sm">
            Total
          </p>
          <p className="font-medium tracking-wide lg:text-lg text-sm">
            {formatPrice(currency, total)}
          </p>
        </div> */}
        <div className="flex items-center justify-between w-full mt-3">
          <p className="font-semibold tracking-wide lg:text-lg text-sm">
            Total
          </p>
          <p className="font-medium tracking-wide lg:text-lg text-sm">
            {formatPrice(currency, total)}
          </p>
        </div>

        {/* {currency !== "NGN" && (
          <p className="text-xs text-gray-600 mt-1 text-right">
            ≈ {formatPrice("NGN", total * rate)} (Payable in Naira)
          </p>
        )} */}
      </div>
    </div>
  );
}

"use client";

import { getDiscount } from "@/helpers/api-controller";
import { formatPrice } from "@/helpers/functions";
import { useAppContext } from "@/helpers/store";
import { CartItemProps } from "@/helpers/types";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CheckoutBox({
  currency,
  rate,
  discount,
  setDiscount,
  shippingFee,
  price,
}: {
  currency: string;
  rate: number;
  discount: number;
  setDiscount: (value: number) => void;
  shippingFee: number | undefined;
  price: number;
}) {
  const [code, setcode] = useState("");

  const context = useAppContext();

  const { cart, setcart } = context;

  const handleSetDiscount = (data: any) => {
    setcart({ ...cart, discount: code });
    setDiscount(data?.discount);
    alert(`${data?.discount}% Discount added`);
  };

  const getDiscountMutation = useMutation({
    mutationFn: () => getDiscount(code),
    onSuccess: (data) =>
      data?.hasOwnProperty("discount")
        ? handleSetDiscount(data)
        : alert(data?.message),
  });

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
    <div className="p-3 border border-dark lg:w-[46%] w-full lg:mb-0 mb-16">
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
          return (
            <div
              className="flex lg:flex-row flex-col lg:items-center items-start lg:justify-between w-full lg:mb-2 mb-3"
              key={c?.item?.id}
            >
              <div className="flex items-center w-full justify-start">
                {c?.item.image ? (
                  <Image
                    priority
                    width={100}
                    height={150}
                    src={c?.item.image}
                    alt="Product Image"
                    className=" mr-4"
                  />
                ) : (
                  <></>
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
                </div>
              </div>
              <p className="lg:text-base text-sm lg:mt-0 mt-4">
                {formatPrice(currency, c?.item?.price * c?.quantity * rate)}
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
        <div
          className={`flex items-center justify-between w-full ${
            discount > 0 ? "mt-4" : "mt-8"
          }`}
        >
          <p className="font-medium tracking-wide lg:text-base text-xs">
            Subtotal
          </p>
          <p className="font-light tracking-wide lg:text-base text-xs">
            {formatPrice(
              currency,
              cart?.items?.reduce(
                (sum, item) => item.item.price * item.quantity + sum,
                0
              ) * rate
            )}
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="font-medium tracking-wide lg:text-base text-xs">
            Shipping Fee
          </p>
          <p className="font-light tracking-wide lg:text-base text-xs">
            {formatPrice(currency, shippingFee ?? 0 * rate)}
          </p>
        </div>
        <div className="flex items-center justify-between w-full mt-3">
          <p className="font-semibold tracking-wide lg:text-lg text-sm">
            Total
          </p>
          <p className="font-medium tracking-wide lg:text-lg text-sm">
            {shippingFee
              ? formatPrice(currency, price * rate + shippingFee)
              : formatPrice(currency, price * rate)}
          </p>
        </div>
      </div>
    </div>
  );
}

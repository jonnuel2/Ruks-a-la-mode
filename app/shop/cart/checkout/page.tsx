"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/helpers/store";
import CheckoutForm from "./_ui/checkout-form";
import CheckoutBox from "./_ui/checkout-box";
import { makePayment } from "@/helpers/api-controller";
import { getShippingFee } from "@/helpers/functions";

export default function Page() {
  const context = useAppContext();
  const { user, setuser, cart, currency, exchangeRates, setcart } = context;
  const router = useRouter();

  const [shippingFee, setShippingFee] = useState<number | undefined>(undefined);
  type ShippingType = "standard" | "express";
  const [deliveryType, setDeliveryType] = useState<ShippingType>("standard");
  const [discount, setDiscount] = useState(0);

  // Price calculation
  const price =
    cart?.items?.reduce(
      (sum, item) => item.item?.price * item.quantity + sum,
      0
    ) || 0;

  const discountPrice = discount > 0 ? price - (discount / 100) * price : price;

  // Restore user on page load if missing in context
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setuser(JSON.parse(storedUser));
      } else {
        // Redirect to login with redirect back to checkout
        router.push("/Auth/login?redirect=/shop/checkout");
      }
    }
  }, [user, router, setuser]);

  // Restore cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setcart(JSON.parse(storedCart));
      }
    }
  }, [setcart]);

  const handleShippingFee = (shippingInfo: any) => {
    const weights = cart?.items?.map((item) => ({
      weight: item.item.weight,
      quantity: item.quantity,
    }));
    const fee = getShippingFee(
      {
        city: shippingInfo?.city,
        country: shippingInfo?.country,
        state: shippingInfo?.state,
      },
      weights,
      deliveryType
    );
    // if (fee) {
    //   setShippingFee(fee);
    // }
    if (fee !== undefined && fee !== null) {
  setShippingFee(fee);
}
  };

  const handleCheckout = async (shippingInfo: any) => {
    if (shippingFee === undefined) return;

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

    const response = await makePayment({
      email: shippingInfo?.email,
      price: discountPrice + shippingFee,
      callbackUrl: `https://ruksalamode.com/shop/confirmation/?email=${
      // callbackUrl: `http://localhost:3000/shop/confirmation/?email=${
        shippingInfo?.email
      }&quantity=${cart?.items?.reduce(
        (sum, item) => item.quantity + sum,
        0
      )}&price=${discountPrice + shippingFee}&currency=${currency}`,
      currency,
    });

    if (response["status"]) {
      router.push(response["data"]["authorization_url"]);
    }
  };

  // While waiting for user info
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full lg:px-20 px-6">
      <div className="lg:mb-20 mt-3 lg:mt-10 w-full flex lg:flex-row flex-col-reverse lg:items-start items-center lg:justify-center lg:space-y-0 lg:space-x-10">
        <div className="w-full lg:w-1/2">
          <h2 className="lg:text-4xl text-xl font-medium tracking-wide">
            Delivery Information
          </h2>
          <CheckoutForm
            checkoutCart={
              shippingFee !== undefined ? handleCheckout : handleShippingFee
            }
            shippingFee={shippingFee}
            setShippingFee={setShippingFee}
            deliveryType={deliveryType}
            setDeliveryType={(d) => setDeliveryType(d as ShippingType)}
          />
        </div>
        <CheckoutBox
          price={discountPrice}
          discount={discount}
          setDiscount={setDiscount}
          currency={currency}
          rate={exchangeRates[currency.toLowerCase()]}
          shippingFee={shippingFee}
          deliveryType={deliveryType}
        />
      </div>
    </div>
  );
}

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

  // console.log(exchangeRates, "exchange", currency,)

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

  // const handleCheckout = async (shippingInfo: any) => {
  //   if (shippingFee === undefined) return;

  //   localStorage.setItem("cart", JSON.stringify(cart));
  //   localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

  //   const response = await makePayment({
  //     email: shippingInfo?.email,
  //     price: discountPrice + shippingFee,
  //     callbackUrl: `https://ruksalamode.com/shop/confirmation/?email=${
  //       // callbackUrl: `http://localhost:3001/shop/confirmation/?email=${
  //       shippingInfo?.email
  //     }&quantity=${cart?.items?.reduce(
  //       (sum, item) => item.quantity + sum,
  //       0
  //     )}&price=${discountPrice + shippingFee}&currency=${currency}`,
  //     currency,
  //   });

  //   if (response["status"]) {
  //     router.push(response["data"]["authorization_url"]);
  //   }
  // };

  const handleCheckout = async (shippingInfo: any) => {
  if (shippingFee === undefined) return;

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

  const vat = 0.075 * discountPrice; // 🧮 Add VAT
  const totalUSD = discountPrice + vat + (shippingFee ?? 0); // 🧮 Final total

  let finalAmountInNGN = totalUSD;

  if (currency !== "NGN") {
    const rate = exchangeRates?.[currency.toLowerCase()] || 1;
    finalAmountInNGN = Math.round(totalUSD * rate);
    console.log(">>>>, newFinalAmount", finalAmountInNGN)
  }
console.log({totalUSD} )
  const quantity = cart?.items?.reduce((sum, item) => item.quantity + sum, 0);
console.log(finalAmountInNGN, "final")

  const response = await makePayment({
    email: shippingInfo?.email,
    price: finalAmountInNGN,
    callbackUrl: `https://ruksalamode.com/shop/confirmation/?email=${shippingInfo?.email}&quantity=${quantity}&price=${finalAmountInNGN}&currency=NGN`,
    currency: "NGN",
  });

  // console.log(response.data, "response")

  if (response?.status) {
    router.push(response.data.authorization_url);
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
        {/* <CheckoutBox
          price={discountPrice}
          discount={discount}
          setDiscount={setDiscount}
          currency={currency}
          rate={exchangeRates[currency.toLowerCase()]}
          shippingFee={shippingFee}
          deliveryType={deliveryType}
        /> */}
        <CheckoutBox
          price={discountPrice}
          discount={discount}
          setDiscount={setDiscount}
          currency={currency}
          rate={exchangeRates[currency.toLowerCase()]} // 🟢 This must return NGN equivalent of 1 unit of `currency`
          shippingFee={shippingFee}
          deliveryType={deliveryType}
        />
      </div>
      {/* notice */}
      <div className="mt-2 bg-green-50 border border-green-200 p-4 rounded-md text-sm text-green-900">
        <p>
          Prefer to pick up your order? Send us a request via{" "}
          <a
            href="https://wa.me/2349012101539"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 font-semibold underline"
          >
            WhatsApp
          </a>{" "}
          and we’ll arrange it for you.
        </p>
      </div>
    </div>
  );
}

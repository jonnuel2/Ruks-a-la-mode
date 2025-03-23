"use client";

import Header from "@/app/ui/header";
import { useAppContext } from "@/helpers/store";
import CheckoutForm from "./_ui/checkout-form";
import CheckoutBox from "./_ui/checkout-box";
import { makePayment } from "@/helpers/api-controller";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getShippingFee } from "@/helpers/functions";

export default function Page() {
  const context = useAppContext();
  const { cart, currency, exchangeRates, setcart } = context;
  const router = useRouter();

  const [shippingFee, setShippingFee] = useState(undefined);

  const [deliveryType, setDeliveryType] = useState("standard");

  const [discount, setDiscount] = useState(0);

  const price = cart?.items?.reduce(
    (sum, item) => item.item?.price * item.quantity + sum,
    0
  );

  const discountPrice = discount > 0 ? price - (discount / 100) * price : price;

  const handleShippingFee = (shippingInfo: any) => {
    let weights = cart?.items?.map((item) => {
      return {
        weight: item.item.weight,
        quantity: item?.quantity,
      };
    });
    let fee = getShippingFee(
      {
        city: shippingInfo?.city,
        country: shippingInfo?.country,
        state: shippingInfo?.state,
      },
      weights,
      deliveryType
    );

    if (fee) {
      setShippingFee(fee);
    }
  };

  const handleCheckout = async (shippingInfo: any) => {
    if (shippingFee === undefined) return;

    console.log("buying");
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    const response = await makePayment({
      email: shippingInfo?.email,
      price: discountPrice + shippingFee,
      callbackUrl: `https://ruksalamode.com/shop/confirmation/?email=${
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
            setDeliveryType={(d) => setDeliveryType(d)}
          />
        </div>
        <CheckoutBox
          price={discountPrice}
          discount={discount}
          setDiscount={setDiscount}
          currency={currency}
          rate={exchangeRates[currency.toLowerCase()]}
          shippingFee={shippingFee}
        />
      </div>
    </div>
  );
}

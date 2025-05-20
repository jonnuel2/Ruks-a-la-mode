"use client";

import {
  createOrder,
  updateProductsStock,
  verifyTransaction,
} from "@/helpers/api-controller";
import emailjs from "@emailjs/browser";
import { useMutation } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Blocks } from "react-loader-spinner";

interface ShippingInfo {
  address: string;
  country: string;
  city: string;
  state: string;
  phonenumber: string;
  email: string;
  firstname: string;
  surname: string;
  zipCode: string;
}

function Confirmation() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const email = searchParams.get("email");
  const quantity = searchParams.get("quantity");
  const price = searchParams.get("price");

  const router = useRouter();

  const [isMessageSending, setIsMessageSending] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const today = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);

  const [cart, setCart] = useState<any>({ items: [], discount: "" });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>();
  const [discount, setdiscount] = useState("");

  // Format price as currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(parseInt(amount || '0'));
  };

  // Helper function to extract measurement/size information
  const getMeasurementString = (measurement: any) => {
    if (!measurement) return null;
    
    // Check for direct size property first
    if (measurement.size) {
      return measurement.size;
    }
    
    // Check for custom measurements
    if (measurement.custom && typeof measurement.custom === 'object') {
      const entries = Object.entries(measurement.custom);
      if (entries.length > 0) {
        return entries.map(([key, value]) => 
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
        ).join(", ");
      }
    }
    
    // Check for direct measurements (like length, width, etc.)
    const standardMeasurements = Object.entries(measurement)
      .filter(([key]) => !['custom'].includes(key))
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
    
    if (standardMeasurements.length > 0) {
      return standardMeasurements.join(", ");
    }
    
    return null;
  };

  const orderItemsHTML = cart?.items?.map((item: any) => {
    const measurement = getMeasurementString(item.item?.measurement);
    const color = item.item?.color?.name || item?.color?.name;
    
    return `
      <tr>
        <td>${item.item?.name || 'N/A'}</td>
        <td>${measurement || 'One Size'}</td>
        <td>${color || 'Standard'}</td>
        <td>${item.quantity || 1}</td>
        <td>${item.item?.price ? formatCurrency(item.item.price) : 'N/A'}</td>
      </tr>
    `;
  }).join("");

  const templateParams = {
    user_name: shippingInfo?.firstname + " " + shippingInfo?.surname,
    order_id: reference || "N/A",
    order_date: today,
    order_total: price || "0",
    formatted_order_total: formatCurrency(price || "0"),
    shipping_name: shippingInfo?.firstname + " " + shippingInfo?.surname,
    shipping_address: [
      shippingInfo?.address,
      shippingInfo?.city,
      shippingInfo?.state,
      shippingInfo?.country,
      shippingInfo?.zipCode
    ].filter(Boolean).join(", "),
    customer_email: shippingInfo?.email || email || "N/A",
    customer_phone: shippingInfo?.phonenumber || "N/A",
    order_items: orderItemsHTML,
    to_mail: shippingInfo?.email || email,
  };

  const sendEmail = async () => {
    setIsMessageSending(true);
    emailjs.init({
      publicKey: process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY,
      blockHeadless: true,
      limitRate: {
        id: "app",
        throttle: 10000,
      },
    });
    
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAIL_JS_ORDER_TEMPLATE_ID ?? "",
        templateParams
      );
      setIsMessageSending(false);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Failed to send email:", error);
      setIsMessageSending(false);
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: (order: any) => createOrder(order),
    onSuccess: (data: any) => {
      if (data?.data?.message === "doppelganger") {
        router.replace("/");
      } else {
        sendEmail();
      }
    },
  });

  const verifyPayment = async () => {
    setIsVerifying(true);
    if (!reference || !email || !quantity || !price) {
      return alert("Incomplete verification parameters");
    }

    try {
      const verificationResponse = await verifyTransaction(reference);
      console.log(verificationResponse);

      if (verificationResponse?.message === "Verification successful") {
        if (shippingInfo?.address && shippingInfo?.city && shippingInfo?.phonenumber) {
          createOrderMutation.mutate({
            items: cart?.items,
            shippingInfo,
            createdAt: today,
            txref: reference,
            price: parseInt(price),
            discount: cart?.discount,
          });
        }
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
        console.log("Cart items with measurements:", parsedCart.items.map((item: any) => ({
          name: item.item?.name,
          measurement: item.item?.measurement,
          color: item.item?.color || item.color
        })));
        localStorage.setItem("cart", JSON.stringify({ items: [], discount: "" }));
      }
      
      const storedInfo = localStorage.getItem("shippingInfo");
      if (storedInfo) {
        setShippingInfo(JSON.parse(storedInfo));
        localStorage.setItem("shippingInfo", JSON.stringify({}));
      }
    }
  }, []);

  useEffect(() => {
    if (cart?.items?.length > 0) {
      verifyPayment();
    }
  }, [reference, email, quantity, price, cart?.items, shippingInfo]);

  if (createOrderMutation.isPending || isMessageSending || isVerifying) {
    return (
      <div className="flex flex-col items-center space-y-5">
        <p className="text-center">
          PLEASE STAY ON THIS PAGE AS WE CONFIRM YOUR ORDER
        </p>
        <Blocks />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center lg:pb-16">
      <p className="text-center lg:text-6xl text-3xl mt-28 capitalize">
        Thank you for your purchase! 
      </p>
      <p className="text-center text-lg font-semibold mt-8 lg:w-2/3">
        A confirmation email has been sent to {email} with your order details. We appreciate you! 
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Confirmation />
    </Suspense>
  );
}
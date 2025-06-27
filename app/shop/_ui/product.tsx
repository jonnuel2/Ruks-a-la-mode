"use client";

import { formatPrice } from "@/helpers/functions";
import { useAppContext } from "@/helpers/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

type ProductComponentProps = {
  product: any;
  viewProduct?: () => void;
};

export default function Product({
  product,
  viewProduct,
}: ProductComponentProps) {
  const context = useAppContext();
  const { exchangeRates, currency, setCurrency, cart, setcart } = context;
  const router = useRouter();

  const isOutOfStock = product?.data?.totalStock <= 0;

  // Detect user location and update currency
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country_code !== "NG") {
          setCurrency("USD");
        } else {
          setCurrency("NGN");
        }
      } catch (error) {
        console.error("Error detecting location:", error);
      }
    };

    fetchUserLocation();
  }, [setCurrency]);

  // Add product to cart with proper price preservation
  const addToBag = () => {
    const existingItemIndex = cart?.items?.findIndex(
      (item: any) => item.item?.id === product?.data?.id
    );

    // Debug: Log the product data to see what we're working with
    console.log("Product data:", product.data);
    console.log("Manual USD price:", product.data.priceInUsd);
    console.log("NGN price:", product.data.price);
    console.log("Exchange rate USD:", exchangeRates["usd"]);

    const newCartItem = {
      item: {
        id: product.data.id,
        name: product.data.name,
        image: product.data.images?.[0] || "",
        price: product.data.price, // Original NGN price
        priceInUsd: product.data.priceInUsd, // Manual USD price
        stock: product.data.totalStock,
        weight: product.data.weight,
        color: product.data.color,
        measurement: product.data.measurement,
      },
      quantity: 1,
    };

    // Debug: Log what we're storing in cart
    console.log("Cart item being stored:", newCartItem);

    let updatedItems;

    if (existingItemIndex !== -1) {
      updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity += 1;
    } else {
      updatedItems = [...(cart?.items || []), newCartItem];
    }

    const updatedCart = { ...cart, items: updatedItems };
    setcart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Debug: Log the final cart
    console.log("Updated cart:", updatedCart);
  };

  return (
    <div
      className={`transition-transform duration-300 ease-out cursor-pointer hover:scale-105 flex flex-col items-center mb-8 relative ${
        isOutOfStock ? "opacity-50" : ""
      }`}
    >
      <div
        onClick={viewProduct}
        className="w-full flex flex-col items-start lg:items-center"
      >
        <div className="relative sm:h-96 w-full h-60 sm:w-80">
          {product?.data?.images[0] && (
            <Image
              priority
              fill
              src={product?.data?.images[0]}
              alt={product?.data?.name}
              className="object-cover"
              sizes="33vw"
            />
          )}

          {isOutOfStock && (
            <div className="absolute top-2 left-2 px-3 py-1 bg-[#bb3a00] text-white text-xs font-semibold rounded-full shadow-md">
              OUT OF STOCK
            </div>
          )}
        </div>

        <p className="lg:text-base mt-6 text-xs lg:w-auto w-32 font-medium uppercase mb-2 text-left lg:text-center text-dark">
          {product?.data?.name}
        </p>
        <p className="lg:text-base text-xs font-light text-center text-dark">
          {formatPrice(
            currency,
            currency === "NGN"
              ? product?.data?.price
              : product?.data?.priceInUsd ||
                  product?.data?.price * exchangeRates["usd"]
          )}
        </p>
      </div>

      {!isOutOfStock && (
        <button
          onClick={addToBag}
          className="mt-3 px-4 py-2 text-xs bg-black text-white rounded hover:opacity-70"
        >
          Add to Bag
        </button>
      )}
    </div>
  );
}

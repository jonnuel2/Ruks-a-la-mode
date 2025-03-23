"use client";

import { formatPrice } from "@/helpers/functions";
import { useAppContext } from "@/helpers/store";
import Image from "next/image";

type ProductComponentProps = {
  addToBag: () => void;
  isInCart?: boolean;
  viewProduct?: () => void;
  product: any;
};

export default function Product({
  product,
  viewProduct,
}: ProductComponentProps) {
  const context = useAppContext();

  const { exchangeRates, currency } = context;

  return (
    <div
      className={`${""} transition-transform duration-300 ease-out cursor-pointer hover:scale-105 flex flex-col items-center mb-8 relative`}
    >
      <div onClick={viewProduct} className="w-fit">
        <div className="relative lg:h-96 w-32 h-40 lg:w-80">
          {product?.data?.images[0] ? (
            <Image
              priority
              fill={true}
              src={product?.data?.images[0]}
              alt={product?.data?.name}
              className="object-cover"
              sizes="33vw"
            />
          ) : (
            <></>
          )}
          {/* <div className=" absolute lg:top-1 lg:left-1 top-2 left-2 py-2 px-4 flex items-center justify-center rounded-full bg-white shadow-dark/20 shadow-md">
            <p className="text-xs uppercase opacity-60">NEW</p>
          </div> */}
        </div>
        <p className="lg:text-base mt-6 text-xs lg:w-auto w-32 font-medium uppercase mb-2 text-center text-dark">
          {product?.data?.name}
        </p>
        <p className="lg:text-base text-xs font-light text-center text-dark">
          {formatPrice(
            currency,
            product?.data?.price * exchangeRates[currency.toLowerCase()]
          )}
        </p>
      </div>
    </div>
  );
}

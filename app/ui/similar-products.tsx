"use client";

import { useAppContext } from "@/helpers/store";
import React from "react";
import Product from "../shop/_ui/product";
import { CategoryGridProps } from "@/helpers/types";
import { useQuery } from "@tanstack/react-query";
import { getAllActiveProducts } from "@/helpers/api-controller";

export default function SimilarProducts({
  items,
  viewProduct,
}: CategoryGridProps) {
  const context = useAppContext();
  const { setSelectedProduct } = context;

  return (
    <>
      {items?.length > 0 && (
        <div className="w-full flex flex-col items-center justify-center py-6 mt-16">
          <p className="tracking-wide font-semibold lg:text-3xl text-xl mb-10">
            MORE YOU MAY LIKE
          </p>
          <div className="lg:w-full grid lg:grid-cols-4 grid-cols-2 lg:gap-28 gap-5">
            {items?.map((m: any) => (
              <Product
                key={m.id}
                product={m}
                viewProduct={() => {
                  setSelectedProduct(m);
                  viewProduct(m.id);
                }} // Pass viewProduct function
                addToBag={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

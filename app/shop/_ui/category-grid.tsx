"use client";

import { CategoryGridProps, ProductProps } from "@/helpers/types";
import Product from "./product";
import { useAppContext } from "@/helpers/store";

export default function CategoryGrid({
  items,
  viewProduct,
}: CategoryGridProps) {
  const context = useAppContext();
  const { setSelectedProduct } = context;
  return (
    <div className="w-full lg:w-[94%] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6 mt-8">
      {items?.map((m) => (
        <Product
          key={m.id}
          product={m}
          viewProduct={() => {
            setSelectedProduct(m);
            viewProduct(m.id);
          }} // Pass viewProduct function
          // addToBag={() => {}}
        />
      ))}
    </div>
  );
}

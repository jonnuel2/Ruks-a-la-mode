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
    <div className="lg:w-[94%] grid lg:grid-cols-4 grid-cols-2 lg:gap-6 gap-5 mt-8">
      {items?.map((m) => (
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
  );
}

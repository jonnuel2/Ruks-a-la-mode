"use client";

import BrandMerch from "./category-grid";
import { honk } from "@/styles/fonts";

interface CategorySectionProps {
  category: string;
  items: any[];
  viewProduct: (id: string) => void;
}

export default function CategorySection({
  category,
  items,
  viewProduct,
}: CategorySectionProps) {
  return (
    <div className="w-full flex flex-col items-center mb-20">
      <h2 className={`text-6xl font-bold mb-4 uppercase ${honk.className}`}>
        {category}
      </h2>
      <BrandMerch items={items} viewProduct={viewProduct} />
    </div>
  );
}

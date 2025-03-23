"use client";

import CategoryGrid from "../shop/_ui/category-grid";
import { useQuery } from "@tanstack/react-query";
import { getAllActiveProducts } from "@/helpers/api-controller";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

export default function BestSeller() {
  const router = useRouter();

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllActiveProducts(),
  });

  const products: any = allProducts?.products;

  const viewProduct = (id: string) => {
    router.push(`/shop/${id}`);
  };

  if (isLoading)
    return (
      <div className="w-full mt-6 flex flex-col items-center justify-center">
        <TailSpin color="#0e0e0e" />
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center justify-start mt-10 lg:mt-14">
      <CategoryGrid items={products?.slice(0, 4)} viewProduct={viewProduct} />
    </div>
  );
}

"use client";

import { useAppContext } from "@/helpers/store";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryGrid from "./_ui/category-grid";
import FilterBox from "./_ui/filter-box";
import { useQuery } from "@tanstack/react-query";
import { getAllActiveProducts } from "@/helpers/api-controller";
import { Blocks } from "react-loader-spinner";

function ShopPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const router = useRouter();
  const context = useAppContext();

  const { set_all_products } = context;

  const {
    data: allProducts,
    isLoading,
    isError,
    refetch: refetchProducts,
  } = useQuery({
    staleTime: 0, // Forces re-fetch every time
    refetchOnWindowFocus: true, // Refetch when tab is focused
    queryKey: ["products"],
    queryFn: () => getAllActiveProducts(),
  });

  const products: any = allProducts?.products ?? [];

  // Extract unique categories
  const categories: string[] = products
    ? Array.from(
        new Set(
          products
            .map((p: any) => p?.data?.category?.toLowerCase()) // Extract categories
            .filter((category: string): category is string => !!category) // Filter out undefined
        )
      )
    : [];

  // State for selected filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "low-to-high" | "high-to-low" | "a-z" | "z-a" | "newest" | "oldest" | null
  >(null);

  // Filter and sort function
  const filteredProducts = React.useMemo(() => {
    let filtered = products || [];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product: any) =>
          product?.data?.category?.toLowerCase() ===
          selectedCategory?.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (product: any) =>
          product?.data?.name?.toLowerCase().includes(searchLower) || // Match product name
          product?.data?.category?.toLowerCase().includes(searchLower) // Match category
      );
    }

   // Sort logic
if (sortOrder === "low-to-high") {
  filtered = filtered.sort((a: any, b: any) => a?.data?.price - b?.data?.price);
} else if (sortOrder === "high-to-low") {
  filtered = filtered.sort((a: any, b: any) => b?.data?.price - a?.data?.price);
} else if (sortOrder === "a-z") {
  filtered = filtered.sort((a: any, b: any) =>
    a?.data?.name.localeCompare(b?.data?.name)
  );
} else if (sortOrder === "z-a") {
  filtered = filtered.sort((a: any, b: any) =>
    b?.data?.name.localeCompare(a?.data?.name)
  );
} else if (sortOrder === "newest") {
  filtered = filtered.sort(
    (a: any, b: any) =>
      new Date(b?.data?.createdAt).getTime() -
      new Date(a?.data?.createdAt).getTime()
  );
} else if (sortOrder === "oldest") {
  filtered = filtered.sort(
    (a: any, b: any) =>
      new Date(a?.data?.createdAt).getTime() -
      new Date(b?.data?.createdAt).getTime()
  );
}


    return filtered;
  }, [products, selectedCategory, sortOrder, search]);

  // Function to handle viewing a product
  const viewProduct = (id: string) => {
    router.push(`/shop/${id}`);
  };

  useEffect(() => {
    set_all_products(products);
  }, [products]);

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Blocks />
      </div>
    );

  return (
    <div className="w-screen flex flex-col items-center justify-start px-4 lg:px-0">
      {/* FilterBox: Pass callbacks to update filters */}
      <FilterBox
        clearFilter={() => {
          setSelectedCategory(null);
          setSortOrder(null);
        }}
        categories={categories ?? [""]}
        onCategorySelect={(category) => setSelectedCategory(category)}
        onSortOrderSelect={(order) => setSortOrder(order)}
      />
      {/* Display filtered products */}
      <CategoryGrid items={filteredProducts} viewProduct={viewProduct} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}

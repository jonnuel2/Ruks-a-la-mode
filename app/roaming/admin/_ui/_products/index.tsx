// app/admin/products/page.tsx
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ProductTable from "./products-table";
import ProductModal from "./product-modal";
import SearchBar from "./search-bar";
import CategoryFilter from "./categories-filter";
import { ProductProps } from "@/helpers/types";
import {
  addNewProduct,
  getAllProducts,
  updateProduct,
} from "@/helpers/api-controller";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    ProductProps | undefined
  >(undefined);

  // Fetch all products
  const {
    data: allProducts,
    isLoading,
    isError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(),
  });

  const addProductMutation = useMutation({
    mutationFn: (pro: any) => addNewProduct(pro),
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
  });

  // Filter products based on search query and category
  const filteredProducts = allProducts?.products?.filter((product: any) => {
    const matchesSearch =
      product.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.data.category.toLowerCase() === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Handle saving a product (add or edit)
  const handleSaveProduct = async (product: ProductProps) => {
    if (product.id) {
      // Edit existing product
      updateProductMutation.mutate(product);
    } else {
      // Add new product
      addProductMutation.mutate(product);
    }
    // window.location.reload(); // Refresh the page to reflect changes
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="flex justify-between mb-6">
        <SearchBar onSearch={setSearchQuery} />
        <CategoryFilter
          onSelectCategory={setSelectedCategory}
          categories={
            allProducts?.products
              ? Array.from(
                  new Set(
                    allProducts?.products
                      .map((p: any) => p.data.category?.toLowerCase()) // Extract categories
                      .filter(
                        (category: string): category is string => !!category
                      ) // Filter out undefined
                  )
                )
              : []
          }
        />
        <button
          onClick={() => {
            setSelectedProduct(undefined);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-xs text-white px-4 ml-2 lg:py-2 rounded"
        >
          Add
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error fetching products</p>
      ) : (
        <ProductTable
          onEdit={(product) => {
            setSelectedProduct(product);
            setIsModalOpen(true);
          }}
          onDelete={refetchProducts}
          products={filteredProducts?.map((p: any) => {
            return { id: p?.id, ...p?.data };
          })}
        />
      )}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

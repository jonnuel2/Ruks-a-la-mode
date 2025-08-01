"use client";

import { useState, useMemo } from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState<
    "a-z" | "z-a" | "newest" | "oldest" | "best-seller" | ""
  >("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    ProductProps | undefined
  >(undefined);

  const {
    data: allProducts,
    isLoading,
    isError,
    refetch: refetchProducts,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(),
  });

  if (isError && error) {
    toast.error("Failed to fetch products");
  }

  const addProductMutation = useMutation({
    mutationFn: (pro: any) => addNewProduct(pro),
    onSuccess: () => {
      toast.success("Product added successfully");
      refetchProducts();
    },
    onError: () => toast.error("Failed to add product"),
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully");
      refetchProducts();
    },
    onError: () => toast.error("Failed to update product"),
  });

  const filteredProducts = useMemo(() => {
    if (!allProducts?.products) return [];

    let products = allProducts.products.filter((product: any) => {
      const matchesSearch =
        product.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory
        ? product.data.category.toLowerCase() === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });

    switch (selectedSort) {
      case "a-z":
        products.sort((a: any, b: any) =>
          a.data.name.localeCompare(b.data.name)
        );
        break;
      case "z-a":
        products.sort((a: any, b: any) =>
          b.data.name.localeCompare(a.data.name)
        );
        break;
      case "newest":
        products.sort(
          (a: any, b: any) =>
            new Date(b.data.createdAt).getTime() -
            new Date(a.data.createdAt).getTime()
        );
        break;
      case "oldest":
        products.sort(
          (a: any, b: any) =>
            new Date(a.data.createdAt).getTime() -
            new Date(b.data.createdAt).getTime()
        );
        break;
      case "best-seller":
        products.sort((a: any, b: any) => b.data.sales - a.data.sales); // Assumes `sales` field exists
        break;
    }

    return products;
  }, [allProducts, searchQuery, selectedCategory, selectedSort]);

  const handleSaveProduct = async (product: ProductProps) => {
    if (product.id) {
      // toast.info(`Updating product ${product.name}`);
      updateProductMutation.mutate(product);
    } else {
      // toast.info(`Adding new product ${product.name}`);
      addProductMutation.mutate(product);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
        <div className="flex gap-4 items-center">
          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query);
              // toast.info(`Searching for: ${query}`);
            }}
          />

          <CategoryFilter
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              // toast.info(`Filtering by category: ${category || "All"}`);
            }}
            categories={
              allProducts?.products
                ? Array.from(
                    new Set(
                      allProducts?.products
                        .map((p: any) => p.data.category?.toLowerCase())
                        .filter(
                          (category: string): category is string => !!category
                        )
                    )
                  )
                : []
            }
          />

          {/* Sort Dropdown */}
          <select
            className="text-xs border border-gray-300 rounded px-3 py-2"
            value={selectedSort}
            onChange={(e) => {
              setSelectedSort(e.target.value as any);
              // toast.info(`Sorting by: ${e.target.value}`);
            }}
          >
            <option value="">Sort</option>
            <option value="a-z">Name: A-Z</option>
            <option value="z-a">Name: Z-A</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="best-seller">Best Seller</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(undefined);
            setIsModalOpen(true);
            // toast.info("Opening form to add new product");
          }}
          className="bg-blue-500 text-xs text-white px-4 py-2 rounded"
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
            // toast.info(`Editing product: ${product.name}`);
          }}
          onDelete={() => {
            refetchProducts();
            toast.success("Product deleted successfully");
          }}
          products={filteredProducts.map((p: any) => ({
            id: p.id,
            ...p.data,
          }))}
        />
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // toast.info("Product form closed");
        }}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

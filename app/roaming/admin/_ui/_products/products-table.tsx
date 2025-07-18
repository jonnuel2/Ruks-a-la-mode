// app/admin/products/components/ProductTable.tsx
"use client";

import React, { use, useEffect, useState } from "react";
import { ProductProps } from "@/helpers/types";
import ExtraInfoAccordion from "./extra-info-accordion";
import EditProductModal from "./product-modal";
import DeleteProductModal from "./delete-product-modal";
import { formatPrice } from "@/helpers/functions";

interface ProductTableProps {
  products: ProductProps[];
  onEdit: (product: ProductProps) => void;
  onDelete: () => void;
}
export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");

    useEffect(() => {
    // Fetch the user's IP-based location whether nigeria or usa
    const fetchUserLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country_code !== "NG") {
          setCurrency("USD");
        }
      } catch (error) {
        console.error("Error fetching location:", error); 
      }
    };

    fetchUserLocation();
  }, []);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left text-sm">ID</th>
          <th className="p-2 text-left text-sm">Name</th>
          <th className="p-2 text-left text-sm">Price</th>
          <th className="p-2 text-left text-sm">Category</th>
          <th className="p-2 text-left text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products?.map((product) => (
          <React.Fragment key={product.id}>
            <tr className="border-b">
              <td className="p-2 text-xs">{product.id}</td>
              <td className="p-2 text-xs uppercase">{product.name}</td>
              <td className="p-2 text-xs">
                {/* {formatPrice(currency, product.price)} */}
                                {currency === "NGN"
                  ? formatPrice("NGN", product.price)
                  : formatPrice("USD", product.priceInUsd)}
              </td>
              <td className="p-2 text-xs uppercase">{product.category}</td>
              <td className="p-2">
                <div className="flex lg:flex-row flex-col items-start justify-start lg:space-y-0 space-y-1 space-x-0 lg:space-x-2">
                  <button
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === product.id ? null : product.id
                      )
                    }
                    className="text-blue-500 text-xs hover:underline"
                  >
                    {expandedRow === product.id ? "Hide" : "View"}
                  </button>
                  <button
                    onClick={() => onEdit(product)}
                    className="text-yellow-500 text-xs hover:underline"
                  >
                    Edit
                  </button>
                  <DeleteProductModal
                    productId={product.id}
                    onDelete={onDelete}
                  />
                </div>
              </td>
            </tr>

            {expandedRow === product.id && (
              <tr>
                <td colSpan={5}>
                  <ExtraInfoAccordion product={product} />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

// app/admin/products/components/DeleteProductModal.tsx
"use client";

import { deleteProduct } from "@/helpers/api-controller";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function DeleteProductModal({
  productId,
  onDelete,
}: {
  productId: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: onDelete,
  });

  const handleDelete = () => {
    // Add logic to delete the product
    deleteProductMutation.mutate(productId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-500 hover:underline text-xs"
      >
        Delete
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="textlg font-bold mb-4">Delete Product</h2>
            <p className=" text-xs">
              Are you sure you want to delete this product?
            </p>
            <div className="mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-xs text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-xs text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

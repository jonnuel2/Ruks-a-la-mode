import React, { useState } from "react";

type SizeDetail = {
  size: string;
  stock: number;
  weight: number;
  colors: { color: string; hex: string }[];
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
  sizes: SizeDetail[];
  collection: string;
};

type ProductFormProps = {
  product?: Product;
  onClose: () => void;
  onSubmit: (product: Product) => void;
};

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onClose,
  onSubmit,
}) => {
  const [formState, setFormState] = useState<Product>(
    product || {
      name: "",
      category: "",
      price: 0,
      status: "active",
      sizes: [],
      collection: "",
      id: "",
    }
  );

  const handleChange = (field: keyof Product, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (
    index: number,
    field: keyof SizeDetail,
    value: any
  ) => {
    const updatedSizes = [...formState.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [field]: value };
    setFormState((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSize = () => {
    setFormState((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", stock: 0, weight: 0, colors: [] }],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-3/4">
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border rounded w-full p-2"
            />
          </div>
          {/* Additional fields for category, sizes, etc. */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

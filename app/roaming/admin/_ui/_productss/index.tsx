"use client";

import React, { useState } from "react";
import ProductForm from "./product-form";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
  // sizes: SizeDetail[];
  collection: string;
  quantity?: number;
};

const Products = () => {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  );
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined
  );
  const [products, setProducts] = useState<Product[]>([
    {
      id: "P001",
      name: "Floral Dress",
      category: "Dresses",
      price: 49.99,
      status: "active",
      collection: "Spring 2025",
    },
    {
      id: "P002",
      name: "Leather Jacket",
      category: "Jackets",
      price: 79.99,
      status: "inactive",
      collection: "Winter 2025",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredProducts = products.filter((product) => {
    return (
      (searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true) &&
      (filterCategory ? product.category === filterCategory : true) &&
      (filterStatus ? product.status === filterStatus : true)
    );
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleFormSubmit = (product: Product) => {
    if (editingProduct) {
      // Update product
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      // Add new product
      setProducts((prev) => [
        ...prev,
        { ...product, id: `P${prev.length + 1}` },
      ]);
    }
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const toggleExpand = (id: string) => {
    setExpandedProductId(expandedProductId === id ? null : id);
    setEditingProductId(null); // Exit editing mode if switching rows
  };

  const startEditing = (id: string) => {
    setEditingProductId(id);
  };

  const saveChanges = (id: string, updatedSizes: any[]) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, sizes: updatedSizes } : product
      )
    );
    setEditingProductId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const cancelEditing = () => {
    setEditingProductId(null);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      {/* Add New Product Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Product
      </button>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="Dresses">Dresses</option>
          <option value="Jackets">Jackets</option>
          {/* Add more categories as needed */}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterCategory("");
            setFilterStatus("");
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      <table className="min-w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Product Name</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <React.Fragment key={product.id}>
              <tr>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">{product.category}</td>
                <td className="px-4 py-2 border">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      product.status === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => toggleExpand(product.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    {expandedProductId === product.id ? "Collapse" : "Expand"}
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
              {expandedProductId === product.id && (
                <tr>
                  <td colSpan={5} className="px-4 py-2 border bg-gray-100">
                    <h3 className="text-lg font-semibold mb-2">Size Details</h3>
                    <table className="w-full mb-2">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 border">Size</th>
                          <th className="px-2 py-1 border">Stock</th>
                          <th className="px-2 py-1 border">Weight</th>
                          <th className="px-2 py-1 border">Colors</th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                    {editingProductId === product.id ? (
                      <div className="flex gap-2">
                        <button
                          // onClick={() =>
                          //   saveChanges(
                          //     product.id,
                          //     // product.sizes /* Update logic here */
                          //   )
                          // }
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(product.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* Product Form Modal */}
      {/* {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
          onSubmit={handleFormSubmit}
        />
      )} */}
    </div>
  );
};

export default Products;

"use client";

import React, { useEffect, useState } from "react";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  discountInfo: {
    code: string;
    rate: number | string;
    count: number | string;
    duration: number | string;
  };
  setDiscountInfo: (value: any) => void;
  isEditMode?: boolean;
}

export default function AddDiscountModal({
  isOpen,
  onClose,
  onSubmit,
  discountInfo,
  setDiscountInfo,
  isEditMode = false,
}: DiscountModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6">
          {isEditMode ? "Edit Discount Code" : "Create Discount Code"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isEditMode && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Code</label>
              <input
                type="text"
                value={discountInfo?.code}
                onChange={(e) =>
                  setDiscountInfo({ ...discountInfo, code: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled={isEditMode}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Discount Rate (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={discountInfo?.rate}
              onChange={(e) =>
                setDiscountInfo({ ...discountInfo, rate: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Usage Limit
            </label>
            <input
              type="number"
              min="1"
              value={discountInfo?.count}
              onChange={(e) =>
                setDiscountInfo({ ...discountInfo, count: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              value={discountInfo?.duration}
              onChange={(e) =>
                setDiscountInfo({ ...discountInfo, duration: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-800"
            >
              {isEditMode ? "Update Discount" : "Create Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
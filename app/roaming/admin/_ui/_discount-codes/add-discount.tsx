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
}

export default function AddDiscountModal({
  isOpen,
  onClose,
  onSubmit,
  discountInfo,
  setDiscountInfo,
}: DiscountModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    onClose(); // Close the modal after submission
  };

  console.log(discountInfo);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6">
          Enter Discount Information
        </h2>
        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rate</label>
            <input
              type="text"
              value={discountInfo?.rate}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setDiscountInfo({ ...discountInfo, rate: inputValue });
                }
              }}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="text"
              value={discountInfo?.count}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setDiscountInfo({ ...discountInfo, count: inputValue });
                }
              }}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Duration (Hrs)
            </label>
            <input
              type="text"
              value={discountInfo?.duration}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setDiscountInfo({ ...discountInfo, duration: inputValue });
                }
              }}
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Example Usage:
// const [isModalOpen, setIsModalOpen] = useState(false);
// const handleDeliverySubmit = (data) => console.log("Delivery Info:", data);
// <DeliveryInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleDeliverySubmit} />

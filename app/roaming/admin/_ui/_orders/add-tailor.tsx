"use client";

import React, { useEffect, useState } from "react";

interface AddTailorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tailorInfo: any) => void;
  tailorInfo: {
    name: string;
    phone: string;
  };
  setTailorInfo: (value: any) => void;
}

export default function AddTailorModal({
  isOpen,
  onClose,
  onSubmit,
  tailorInfo,
  setTailorInfo,
}: AddTailorProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tailorInfo);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6">Enter Tailor Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Tailor Name
            </label>
            <input
              type="text"
              value={tailorInfo?.name}
              onChange={(e) =>
                setTailorInfo({ ...tailorInfo, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={tailorInfo?.phone}
              onChange={(e) =>
                setTailorInfo({
                  ...tailorInfo,
                  phone: e.target.value,
                })
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

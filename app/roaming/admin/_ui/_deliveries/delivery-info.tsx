"use client";

import React, { useEffect, useState } from "react";

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  deliveryInfo: {
    trackingId: string;
    deliveryDate: string;
  };
  setDeliveryInfo: (value: any) => void;
}

export default function DeliveryInfoModal({
  isOpen,
  onClose,
  onSubmit,
  deliveryInfo,
  setDeliveryInfo,
}: DeliveryModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    onClose(); // Close the modal after submission
  };

  console.log(deliveryInfo);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-semibold mb-6">
          Enter Delivery Information
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Tracking ID
            </label>
            <input
              type="text"
              value={deliveryInfo?.trackingId}
              onChange={(e) =>
                setDeliveryInfo({ ...deliveryInfo, trackingId: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter Tracking ID"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              value={deliveryInfo?.deliveryDate}
              onChange={(e) =>
                setDeliveryInfo({
                  ...deliveryInfo,
                  deliveryDate: e.target.value,
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

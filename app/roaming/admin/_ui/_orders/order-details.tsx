import { formatPrice } from "@/helpers/functions";
import React from "react";

type Order = {
  id: string;
  email: string;
  createdAt: string;
  status: string;
  items: { productName: string; quantity: number; price: number }[];
};

type OrderDetailsProps = {
  order: any;
  onClose: () => void;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const getMeasurementString = (measurement: any) => {
    if (!measurement) return null;

    // Handle both standard measurements (size/length) and custom measurements
    const entries = measurement.custom 
      ? Object.entries(measurement.custom)
      : Object.entries(measurement).filter(([key]) => key !== "custom");

    if (entries.length === 0) return null;

    return (
      <div className="flex flex-col">
        {entries.map(([key, value]) => (
          <p key={key} className="font-extralight tracking-wide text-[9px]">
            {`${key.charAt(0).toUpperCase() + key.slice(1)}-${value}`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md lg:w-3/4 w-full max-h-[90vh] overflow-y-auto">
        <h2 className="lg:text-xl font-bold mb-4">
          Order Details - {order.id}
        </h2>
        <p className="mb-2 text-xs">
          Customer: {order?.data?.shippingInfo?.email || "N/A"}
        </p>
        <p className="mb-2 text-xs">
          Order Date: {order?.data?.createdAt || "N/A"}
        </p>
        <p className="mb-2 text-xs capitalize">
          Status: {order?.data?.status || "N/A"}
        </p>
        <p className="mb-4 text-sm">
          Total: {formatPrice("NGN", order?.data?.price || 0)}
        </p>

        {order?.data?.tailors?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm mb-1 font-semibold">Assigned Tailors</p>
            <ul>
              {order.data.tailors.map((t: any, i: number) => (
                <li key={i} className="text-xs">
                  {t.name} - {t.phone}
                </li>
              ))}
            </ul>
          </div>
        )}

        <h3 className="lg:text-lg font-bold mb-2">Items:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow rounded mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-xs text-left">Product</th>
                <th className="px-4 py-2 border text-xs text-left">Quantity</th>
                <th className="px-4 py-2 border text-xs text-left">Price</th>
                <th className="px-4 py-2 border text-xs text-left">Size</th>
                <th className="px-4 py-2 border text-xs text-left">Color</th>
              </tr>
            </thead>
            <tbody>
              {order?.data?.items?.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2 border text-xs">
                    {item?.item?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-xs">
                    {item?.quantity || "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-xs">
                    {formatPrice("NGN", item?.item?.price || 0)}
                  </td>
                  <td className="px-4 py-2 border text-xs">
                    {getMeasurementString(item?.item?.measurement)}
                  </td>
                  <td className="px-4 py-2 border text-xs">
                    {item?.item?.color?.name || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 text-xs rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
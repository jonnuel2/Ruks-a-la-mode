import { formatPrice } from "@/helpers/functions";
import React from "react";

type OrderDetailsProps = {
  order: any;
  onClose: () => void;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const getMeasurementString = (measurement: any) => {
    if (!measurement) return null;

    const entries = measurement.custom
      ? Object.entries(measurement.custom)
      : Object.entries(measurement).filter(([key]) => key !== "custom");

    if (entries.length === 0) return null;

    return (
      <div className="flex flex-col">
        {entries.map(([key, value]) => (
          <p key={key} className="font-extralight tracking-wide text-sm">
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
        <p className="mb-2 text-sm">
          <span className="font-bold">Name:</span> {order?.data?.shippingInfo?.firstname || "N/A"} {order?.data?.shippingInfo?.surname || "N/A"}
        </p>
        <p className="mb-2 text-sm">
        <span className="font-bold">Email:</span> {order?.data?.shippingInfo?.email || "N/A"}
        </p>
        <p className="mb-2 text-sm">
        <span className="font-bold">Number:</span> {order?.data?.shippingInfo?.phonenumber || "N/A"}
        </p>
        <p className="mb-2 text-sm">
        <span className="font-bold">Order Date:</span> {order?.data?.createdAt || "N/A"}
        </p>
        <p className="mb-2 text-sm capitalize">
        <span className="font-bold">Status:</span> {order?.data?.status || "N/A"}
        </p>
        <p className="mb-4 text-sm font-bold">
          Total: {formatPrice("NGN", order?.data?.price || 0)}
        </p>

        {order?.data?.tailors?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm mb-1 font-semibold">Assigned Tailors</p>
            <ol className="list-decimal list-inside text-sm">
              {order.data.tailors.map((t: any, i: number) => (
                <li key={i}>
                  <span className="font-medium">{t.name}</span> – {t.description}
                </li>
              ))}
            </ol>
          </div>
        )}

        <h3 className="lg:text-lg font-bold mb-2">Items:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow rounded mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border text-sm text-left">Product</th>
                <th className="px-4 py-2 border text-sm text-left">Quantity</th>
                <th className="px-4 py-2 border text-sm text-left">Price</th>
                <th className="px-4 py-2 border text-sm text-left">Size</th>
                <th className="px-4 py-2 border text-sm text-left">Color</th>
              </tr>
            </thead>
            <tbody>
              {order?.data?.items?.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2 border text-sm">
                    {item?.item?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {item?.quantity || "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {formatPrice("NGN", item?.item?.price || 0)}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {getMeasurementString(item?.item?.measurement)}
                  </td>
                  <td className="px-4 py-2 border text-sm">
                    {item?.item?.color?.name || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 text-sm rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;

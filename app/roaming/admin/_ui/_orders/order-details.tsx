import { formatPrice } from "@/helpers/functions";

import React, { useState } from "react";
import AddTailorModal from "./add-tailor";
import { editTailor } from "@/helpers/api-controller";

type OrderDetailsProps = {
  order: any;
  onClose: () => void;
  currency: string;
  exchangeRate?: number;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onClose,
  currency = "NGN",
  exchangeRate = 0.000647,
}) => {
  const [isTailorModalOpen, setTailorModalOpen] = useState(false);
  const [assignedTailors, setAssignedTailors] = useState(
    order?.data?.tailors || []
  );

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

  const getDisplayPrice = (item: any) => {
    if (currency === "NGN") {
      return item?.item?.price || 0;
    } else {
      return (
        item?.item?.priceInUsd ||
        (item?.item?.price || item?.item?.price || 0) * exchangeRate
      );
    }
  };

  console.log("Order Details Rendered", getDisplayPrice);

  

  const orderTotal =
    order?.data?.items?.reduce((sum: number, item: any) => {
      return sum + getDisplayPrice(item) * item.quantity;
    }, 0) || 0;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md lg:w-3/4 w-full max-h-[90vh] overflow-y-auto">
        <h2 className="lg:text-xl font-bold mb-4">
          Order Details - {order.id}
        </h2>
        <p className="mb-2 text-sm">
          <span className="font-bold">Name:</span>{" "}
          {order?.data?.shippingInfo?.firstname || "N/A"}{" "}
          {order?.data?.shippingInfo?.surname || "N/A"}
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">Email:</span>{" "}
          {order?.data?.shippingInfo?.email || "N/A"}
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">Number:</span>{" "}
          {order?.data?.shippingInfo?.phonenumber || "N/A"}
          
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">Country:</span>{" "}
          {order?.data?.shippingInfo?.country || "N/A"}
          
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">Zipcode:</span>{" "}
          {order?.data?.shippingInfo?.zipCode || "N/A"}
          
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">State:</span>{" "}
          {order?.data?.shippingInfo?.state || "N/A"}
          
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">City:</span>{" "}
          {order?.data?.shippingInfo?.city || "N/A"}
          
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">Address:</span>{" "}
          {order?.data?.shippingInfo?.address || "N/A"}
          
        </p>

        <p className="mb-2 text-sm">
          <span className="font-bold">Order Date:</span>{" "}
          {order?.data?.createdAt || "N/A"}
        </p>
        <p className="mb-2 text-sm capitalize">
          <span className="font-bold">Status:</span>{" "}
          {order?.data?.status || "N/A"}
        </p>
        {/* Add Delivery Type display */}
        <p className="mb-2 text-sm capitalize">
          <span className="font-bold">Shipping Method:</span>{" "}
          {order?.data?.shippingInfo?.deliveryType
            ? order.data.shippingInfo?.deliveryType === "standard"
              ? "Standard Shipping"
              : "Express Shipping"
            : "N/A"}
        </p>
        <p className="mb-4 text-sm font-bold">
          Total:
          {/* {formatPrice(currency, orderTotal)} */}
          {order?.data?.price
            ? order.data.price.toLocaleString("en-US", {
                style: "currency",
                currency: order.data.currency || "NGN",
              })
            : "N/A"}
        </p>

        {assignedTailors.length > 0 && (
          <div className="mb-6">
            <p className="text-sm mb-1 font-semibold flex gap-8 items-center">
              Assigned Tailors
              <button
                onClick={() => setTailorModalOpen(true)}
                className="text-xs border rounded-md px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                disabled={assignedTailors.length === 0}
              >
                Edit
              </button>
            </p>
            <ol className="list-decimal list-inside text-sm">
              {assignedTailors.map((t: any, i: number) => (
                <li key={i}>
                  <span className="font-medium">{t.name}</span> –{" "}
                  {t.description}
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
                {/* <th className="px-4 py-2 border text-sm text-left">Measurement</th> */}
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
                    {/* {formatPrice(currency, getDisplayPrice(item))} */}
                    {item?.item?.price
                      ? item.item.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: item.item.currency || "NGN",
                        })
                      : "N/A"}
                  </td>
                  {/* <td className="px-4 py-2 border text-sm">
                    {item?.item?.size?.name || "N/A"}
                  </td> */}
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

      <AddTailorModal
        isOpen={isTailorModalOpen}
        onClose={() => setTailorModalOpen(false)}
        onSubmit={async (newTailors) => {
          try {
            await editTailor({ orderId: order.id, tailors: newTailors });
            setAssignedTailors(newTailors);
            setTailorModalOpen(false);
          } catch (err) {
            console.error(err);
          }
        }}
        orderId={order.id}
        initialData={assignedTailors}
      />
    </div>
  );
};

export default OrderDetails;

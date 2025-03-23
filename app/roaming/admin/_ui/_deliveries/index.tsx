"use client";

import { getDeliveries, updateOrder } from "@/helpers/api-controller";
import { Delivery } from "@/helpers/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DeliveryInfoModal from "./delivery-info";
import emailjs from "@emailjs/browser";

const Deliveries = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMessageSending, setIsMessageSending] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState({
    id: "",
    status: "",
    deliveryDate: "",
    shippingInfo: {
      firstname: "",
      surname: "",
      address: "",
      city: "",
      state: "",
      country: "",
      email: "",
    },
    trackingId: "",
    items: [],
  });

  const {
    data: deliveriesData,
    isLoading,
    isError,
    refetch: refetchDeliveries,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getDeliveries(),
  });

  const deliveries = deliveriesData?.deliveries;

  const updateOrderStatusMutation = useMutation({
    mutationFn: (data: any) => updateOrder(data),
    onSuccess: (d, v) => {
      if (v?.status === "transit") sendEmail();

      refetchDeliveries();
    },
  });

  const orderItemsHTML = deliveryInfo?.items
    ?.map(
      (item: any) => `
    <tr>
      <td>${item.item?.name}</td>
      <td>${item.quantity}</td>
      <td>${item.item.price}</td>
    </tr>
  `
    )
    .join("");

  const templateParams = {
    user_name:
      deliveryInfo?.shippingInfo?.firstname +
      " " +
      deliveryInfo?.shippingInfo?.surname,
    delivery_id: deliveryInfo?.id,
    delivery_date: deliveryInfo?.deliveryDate,
    tracking_id: deliveryInfo?.trackingId,
    delivery_address:
      deliveryInfo?.shippingInfo?.address +
      " " +
      deliveryInfo?.shippingInfo?.city +
      " " +
      deliveryInfo?.shippingInfo?.country,
    order_items: orderItemsHTML,
    to_mail: deliveryInfo?.shippingInfo?.email,
  };

  const sendEmail = async () => {
    setIsMessageSending(true);
    emailjs.init({
      publicKey: process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY,
      // Do not allow headless browsers
      blockHeadless: true,
      limitRate: {
        // Set the limit rate for the application
        id: "app",
        // Allow 1 request per 10s
        throttle: 10000,
      },
    });
    await emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAIL_JS_DELIVERY_TEMPLATE_ID ?? "",
        templateParams,
        {
          publicKey: process.env.EMAIL_JS_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          setIsMessageSending(false);
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  const [filter, setFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Filtered and searched deliveries
  const filteredDeliveries = deliveries?.filter((delivery: any) => {
    const matchesFilter =
      filter === "" ||
      delivery?.data?.status.toLowerCase() === filter.toLowerCase();
    let fullname =
      delivery?.data?.shippingInfo?.firstname +
      " " +
      delivery?.data?.shippingInfo?.surname;
    const matchesSearch =
      fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDeliveries?.length / itemsPerPage);
  const displayedDeliveries: any = filteredDeliveries?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update delivery status
  const updateStatus = (id: string, status: Delivery["status"]) => {
    updateOrderStatusMutation.mutate({ id, status });
  };

  const handleDeliverySubmit = () => {
    updateStatus(deliveryInfo.id, deliveryInfo.status);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Delivery Management</h2>
      {/* Filters and Search */}
      <div className="flex lg:flex-row flex-col items-start lg:items-center lg:justify-between mb-4">
        <div className="flex gap-2">
          {["Ready", "Transit", "Delivered", "Canceled"].map((status) => (
            <button
              key={status.toLowerCase()}
              onClick={() =>
                setFilter(
                  status?.toLowerCase() === filter ? "" : status?.toLowerCase()
                )
              }
              className={`px-4 py-2 rounded text-xs ${
                filter.toLowerCase() === status.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by ID or Customer"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded lg:w-1/3 text-xs lg:mt-0 mt-4"
        />
      </div>
      {/* Deliveries Table */}
      <table className="min-w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border text-xs">Delivery ID</th>
            <th className="px-4 py-2 border text-xs">Customer Name</th>
            <th className="px-4 py-2 border text-xs">Delivery Information</th>
            <th className="px-4 py-2 border text-xs">Status</th>
            <th className="px-4 py-2 border text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedDeliveries?.map((delivery: any) => (
            <tr key={delivery.id}>
              <td className="px-4 py-2 border text-xs">{delivery.id}</td>
              <td className="px-4 py-2 border text-xs">
                {delivery?.data?.shippingInfo?.firstname +
                  " " +
                  delivery?.data?.shippingInfo?.surname}
              </td>
              <td className="px-4 py-2 border text-xs">
                {delivery?.data?.shippingInfo?.address},{" "}
                {delivery?.data?.shippingInfo?.city},{" "}
                {delivery?.data?.shippingInfo?.state},{" "}
                {delivery?.data?.shippingInfo?.country},{" "}
                {delivery?.data?.shippingInfo?.phonenumber}
              </td>
              <td className="px-4 py-2 border text-xs capitalize">
                <span className={`px-2 py-1 rounded text-yellow-500`}>
                  {delivery?.data?.status}
                </span>
              </td>
              <td className="px-4 py-2 border text-xs">
                <button
                  onClick={() => {
                    if (delivery?.data?.status === "ready") {
                      setDeliveryInfo({
                        id: delivery?.id,
                        status: "transit",
                        shippingInfo: delivery?.data?.shippingInfo,
                        items: delivery?.data?.items,
                        deliveryDate: "",
                        trackingId: "",
                      });
                      setIsModalOpen(true);
                    } else {
                      updateStatus(delivery?.id, "delivered");
                    }
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Update Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-200 text-xs disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 text-xs disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <DeliveryInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDeliverySubmit}
        deliveryInfo={deliveryInfo}
        setDeliveryInfo={setDeliveryInfo}
      />
      ;
    </div>
  );
};

export default Deliveries;

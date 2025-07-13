"use client";

import { useEffect, useState, useMemo } from "react";
import OrderDetails from "./order-details";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addTailor, getAllOrders, updateOrder } from "@/helpers/api-controller";
import { Audio } from "react-loader-spinner";
import AddTailorModal from "./add-tailor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Order = {
  id: string;
  email: string;
  createdAt: string;
  status: string;
  items: { productName: string; quantity: number; price: number }[];
};

interface TailorEntry {
  name: string;
  description: string;
}

export default function Orders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const {
    data: allOrders,
    isLoading,
    isError,
    error,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(),
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch orders");
    }
  }, [isError]);

  const updateOrderStatusMutation = useMutation({
    mutationFn: (data: any) => updateOrder(data),
    onSuccess: () => {
      refetchOrders();
      toast.success("Order status updated successfully");
    },
    onError: () => toast.error("Failed to update order status"),
  });

  const addTailorMutation = useMutation({
    mutationFn: (data: any) => addTailor(data),
    onSuccess: () => {
      refetchOrders();
      toast.success("Tailor added successfully");
      if (selectedOrderId) {
        handleStatusChange(selectedOrderId, "producing");
      }
    },
    onError: () => toast.error("Failed to add tailor"),
  });

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [addingTailor, setAddingTailor] = useState(false);
  const itemsPerPage = 12;

  const orders = allOrders?.orders;

  // const parseDateTime = (dateString: string | undefined): Date | null => {
  //   if (!dateString) return null;

  //   // Handle European format "DD/MM/YYYY, HH:mm"
  //   const europeanFormat = dateString.match(
  //     /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/
  //   );
  //   if (europeanFormat) {
  //     const [_, day, month, year, hours, minutes] = europeanFormat;
  //     return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
  //   }

  //   // Handle ISO format
  //   const date = new Date(dateString);
  //   if (!isNaN(date.getTime())) return date;

  //   return null;
  // };

  const parseDateTime = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;

    // Handle European format with time: "DD/MM/YYYY, HH:mm"
    const europeanFormatWithTime = dateString.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2})$/
    );
    if (europeanFormatWithTime) {
      const [_, day, month, year, hours, minutes] = europeanFormatWithTime;
      return new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}T${hours.padStart(2, "0")}:${minutes}:00`
      );
    }

    // Handle European format without time: "DD/MM/YYYY" or "D/M/YYYY"
    const europeanFormat = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (europeanFormat) {
      const [_, day, month, year] = europeanFormat;
      return new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00`
      );
    }

    // Handle ISO format
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;

    return null;
  };

  // const filteredOrders = useMemo(() => {
  //   if (!orders) return [];

  //   return orders
  //     .filter((order: any) => {
  //       const statusMatch =
  //         filter.toLowerCase() === "all" ||
  //         order?.data?.status?.toLowerCase() === filter.toLowerCase();

  //       const searchMatch =
  //         order?.data?.shippingInfo?.email
  //           ?.toLowerCase()
  //           .includes(searchQuery.toLowerCase()) ||
  //         order?.id?.toLowerCase().includes(searchQuery.toLowerCase());

  //       return statusMatch && searchMatch;
  //     })
  //     .sort((a: any, b: any) => {
  //       // Always use createdAt for true chronological order
  //       const dateA = parseDateTime(a.data?.createdAt);
  //       const dateB = parseDateTime(b.data?.createdAt);

  //       if (!dateA || !dateB) return 0;

  //       // For oldest first: true chronological order (first created to last created)
  //       if (sortOrder === "oldest") {
  //         return dateA.getTime() - dateB.getTime();
  //       }
  //       // For newest first: reverse chronological order (last created to first created)
  //       else {
  //         return dateB.getTime() - dateA.getTime();
  //       }
  //     });
  // }, [orders, filter, searchQuery, sortOrder]);

  // Pagination logic
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders
      .filter((order: any) => {
        const statusMatch =
          filter.toLowerCase() === "all" ||
          order?.data?.status?.toLowerCase() === filter.toLowerCase();
        const searchMatch =
          order?.data?.shippingInfo?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order?.id?.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
      })
      .sort((a: any, b: any) => {
        const dateA = parseDateTime(a.data?.createdAt);
        const dateB = parseDateTime(b.data?.createdAt);
        if (!dateA || !dateB) return 0;
        if (sortOrder === "oldest") {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
  }, [orders, filter, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    // toast.info(`Viewing details for order ${order.id}`)
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // toast.info(`Navigated to page ${newPage}`)
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({ id, status: newStatus });
    // toast.info(`Changing order ${id} status to ${newStatus}`)
  };

  const handleAddTailors = (tailorInfoList: TailorEntry[]) => {
    if (!selectedOrderId) return;

    // toast.info(`Adding ${tailorInfoList.length} tailor(s) to order ${selectedOrderId}`)

    // Process each tailor entry
    tailorInfoList.forEach((tailor) => {
      addTailorMutation.mutate({
        id: selectedOrderId,
        name: tailor.name,
        description: tailor.description,
      });
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    // toast.info("Search cleared")
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
    setCurrentPage(1);
    // toast.info(`Sort order changed to ${sortOrder === "newest" ? "oldest" : "newest"}`)
  };

  useEffect(() => {
    if (filteredOrders?.length > 0) {
      console.log("Sorted orders:");
      filteredOrders.forEach((order: any, index: number) => {
        console.log(
          `${index + 1}. ${order.id} - ${order.data?.createdAt}`,
          parseDateTime(order.data?.createdAt)
        );
      });
    }
  }, [filteredOrders]);

  // const formatDate = (dateString: string) => {
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  //   const dateParts = dateString.split(",")[0].split("/")
  //   const day = Number.parseInt(dateParts[0])
  //   const monthIndex = Number.parseInt(dateParts[1]) - 1
  //   const year = Number.parseInt(dateParts[2])

  //   const suffix =
  //     day === 1 || day === 21 || day === 31
  //       ? "st"
  //       : day === 2 || day === 22
  //         ? "nd"
  //         : day === 3 || day === 23
  //           ? "rd"
  //           : "th"

  //   return `${months[monthIndex]} ${day}${suffix}, ${year}`
  // }
  const formatIsoDate = (isoString: string) => {
    if (!isoString) return "N/A";
    const date = parseDateTime(isoString);
    if (!date || isNaN(date.getTime())) return "Invalid Date";
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const getSuffix = (d: number) => {
      if (d === 1 || d === 21 || d === 31) return "st";
      if (d === 2 || d === 22) return "nd";
      if (d === 3 || d === 23) return "rd";
      return "th";
    };
    return `${day}${getSuffix(day)} ${month}, ${year}`;
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className="text-xl font-bold mb-4">Orders</h1>

      {/* Filters Section */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <div>
          <label className="mr-2 font-medium lg:text-sm text-xs">
            Filter by Status:
          </label>
          <select
            className="border rounded px-2 py-1 lg:text-sm text-xs"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value.toLowerCase());
              setCurrentPage(1);
              // toast.info(`Filter set to ${e.target.value.toLowerCase()}`)
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="producing">Producing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex items-center">
          <label className="mr-2 font-medium lg:text-sm text-xs">Search:</label>
          <input
            type="text"
            className="border rounded px-2 py-1 lg:w-64 lg:text-sm text-xs"
            placeholder="Search by customer or order ID"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="ml-2 text-gray-500 hover:text-gray-700 lg:text-sm text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Date Sorting Toggle */}
        <button
          onClick={toggleSortOrder}
          className="border rounded px-3 py-1 text-xs flex items-center gap-1 hover:bg-gray-100"
        >
          <span>Sort by Date:</span>
          <span className="font-medium">
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </span>
          <span>{sortOrder === "newest" ? "↓" : "↑"}</span>
        </button>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center my-4">
          <Audio />
        </div>
      ) : (
        <div>
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white shadow rounded">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border lg:text-sm text-xs text-left">
                    Order ID
                  </th>
                  <th className="px-4 py-2 border lg:text-sm text-xs text-left">
                    Customer
                  </th>
                  <th
                    className="px-4 py-2 border lg:text-sm text-xs text-left cursor-pointer hover:bg-gray-300"
                    onClick={toggleSortOrder}
                  >
                    Date {sortOrder === "newest" ? "↓" : "↑"}
                  </th>
                  <th className="px-4 py-2 border lg:text-sm text-xs text-left">
                    Total
                  </th>
                  <th className="px-4 py-2 border lg:text-sm text-xs text-left">
                    Status
                  </th>
                  <th className="px-4 py-2 border lg:text-sm text-xs text-left">
                    Discount
                  </th>
                  <th className="px-4 py-2 border lg:text-sm text-xs text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-xs">{order.id}</td>
                    <td className="px-4 py-2 border text-xs">
                      <div className="flex flex-col items-start justify-center">
                        <p className="text-xs">
                          {order?.data?.shippingInfo?.firstname +
                            " " +
                            order?.data?.shippingInfo?.surname}
                        </p>
                        <p className="text-xs opacity-60">
                          {order?.data?.shippingInfo?.email}
                        </p>
                        <p className="text-xs opacity-60">
                          {order?.data?.shippingInfo?.phonenumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs border">
                      {/* {order?.data?.createdAt ? formatDate(order?.data?.createdAt) : ""} */}
                      {order?.data?.createdAt
                        ? formatIsoDate(order?.data?.createdAt)
                        : "N/A"}
                      {/* {order?.data?.createdAt || "N/A"} */}
                    </td>
                    <td className="px-4 py-2 text-xs border">
                      {order?.data?.price
                        ? order.data.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: order.data.currency || "NGN",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-xs border">
                      <span
                        className={`px-2 py-1 rounded capitalize ${
                          order?.data?.status === "producing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order?.data?.status === "ready"
                            ? "bg-green-100 text-green-800"
                            : order?.data?.status === "delivered"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order?.data?.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs border">
                      {order?.data?.discount || "0"}
                    </td>
                    <td className="px-4 py-2 border">
                      <div className="flex flex-wrap gap-1">
                        {order?.data?.status === "pending" && (
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded lg:text-xs text-[10px] hover:bg-green-600"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setAddingTailor(true);
                              // toast.info(`Preparing to add tailor to order ${order.id}`)
                            }}
                          >
                            Produce
                          </button>
                        )}
                        {order?.data?.status === "producing" && (
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded lg:text-xs text-[10px] hover:bg-green-600"
                            onClick={() =>
                              handleStatusChange(order.id, "ready")
                            }
                          >
                            Ready
                          </button>
                        )}
                        {(order?.data?.status === "producing" ||
                          order?.data?.status === "pending") && (
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded lg:text-xs text-[10px] hover:bg-red-600"
                            onClick={() =>
                              handleStatusChange(order.id, "canceled")
                            }
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="bg-blue-500 text-white px-2 py-1 rounded lg:text-xs text-[10px] hover:bg-blue-600"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 text-xs hover:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-xs text-gray-700 px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-400"
            >
              Next
            </button>
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              currency={""}
            />
          )}

          {/* No Results Message */}
          {filteredOrders?.length === 0 && (
            <p className="mt-4 text-gray-500 text-xs">
              No orders match your filter and search. Please put a valid filter
              or search
            </p>
          )}
        </div>
      )}
      <AddTailorModal
        isOpen={addingTailor}
        onClose={() => setAddingTailor(false)}
        onSubmit={handleAddTailors}
        orderId={selectedOrderId}
        initialData={[]}
      />
    </div>
  );
}

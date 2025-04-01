import { useEffect, useState, useMemo } from "react";
import OrderDetails from "./order-details";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addTailor, getAllOrders, updateOrder } from "@/helpers/api-controller";
import { Audio } from "react-loader-spinner";
import AddTailorModal from "./add-tailor";

type Order = {
  id: string;
  email: string;
  createdAt: string;
  status: string;
  items: { productName: string; quantity: number; price: number }[];
};

export default function Orders() {
  const [tailorInfo, setTailorInfo] = useState({ name: "", phone: "", id: "" });
  const {
    data: allOrders,
    isLoading,
    isError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(),
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: (data: any) => updateOrder(data),
    onSuccess: () => refetchOrders(),
  });

  const addTailorMutation = useMutation({
    mutationFn: (data: any) => addTailor(data),
    onSuccess: () => handleStatusChange(tailorInfo?.id, "producing"),
  });

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("oldest");
  const [addingTailor, setAddingTailor] = useState(false);
  const itemsPerPage = 12;

  const orders = allOrders?.orders;

  // Improved date parsing function that handles multiple formats
  const parseDate = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;

    // Try parsing as ISO string first
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) return date;

    // Handle "DD/MM/YYYY, HH:mm" format (e.g., "16/03/2025, 19:32")
    const europeanFormat = dateString.match(
      /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/
    );
    if (europeanFormat) {
      const [_, day, month, year, hours, minutes] = europeanFormat;
      // Construct ISO format: YYYY-MM-DDTHH:mm:00
      date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
      if (!isNaN(date.getTime())) return date;
    }

    // Try adding time component if missing
    if (!dateString.includes("T")) {
      date = new Date(`${dateString}T00:00:00`);
      if (!isNaN(date.getTime())) return date;
    }

    // Try replacing space with T if it's in format "YYYY-MM-DD HH:MM:SS"
    if (dateString.includes(" ")) {
      date = new Date(dateString.replace(" ", "T"));
      if (!isNaN(date.getTime())) return date;
    }

    // Try parsing as timestamp
    const timestamp = Date.parse(dateString);
    if (!isNaN(timestamp)) return new Date(timestamp);

    return null;
  };

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
        const dateA =
          parseDate(a.data?.updatedAt || a.data?.createdAt)?.getTime() || 0;
        const dateB =
          parseDate(b.data?.updatedAt || b.data?.createdAt)?.getTime() || 0;

        // Secondary sort by ID if dates are equal
        if (dateA === dateB) {
          return sortOrder === "newest"
            ? b.id.localeCompare(a.id)
            : a.id.localeCompare(b.id);
        }

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [orders, filter, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({ id, status: newStatus });
  };

  const handleAddTailor = () => {
    addTailorMutation.mutate(tailorInfo);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
    setCurrentPage(1);
  };

  

  // Debugging effect - logs date sorting information
  useEffect(() => {
    if (filteredOrders?.length > 0) {
      console.log("Date sorting debug:");
      filteredOrders.forEach((order: any, index: number) => {
        const dateStr = order.data?.updatedAt || order.data?.createdAt;
        console.log({
          position: index + 1,
          id: order.id,
          date: dateStr,
          parsed: parseDate(dateStr),
          status: order.data?.status,
        });
      });
    }
  }, [filteredOrders]);

  // const formatDateTime = (dateString: string) => {
  //   const months = [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "Jul",
  //     "Aug",
  //     "Sep",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ];

  //   const [datePart, timePart] = dateString.split(",");
  //   const [day, month, year] = datePart.trim().split("/").map(Number);
  //   const [time, period] = timePart.trim().split(" ");

  //   let [hours, minutes] = time.split(":").map(Number);

  //   const suffix =
  //     day === 1 || day === 21 || day === 31
  //       ? "st"
  //       : day === 2 || day === 22
  //       ? "nd"
  //       : day === 3 || day === 23
  //       ? "rd"
  //       : "th";

  //   return `${months[month - 1]} ${day}${suffix}, ${year} at ${
  //     hours % 12 || 12
  //   }:${minutes.toString().padStart(2, "0")} ${period}`;
  // };

  const formatDate = (dateString: string) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
  
    const dateParts = dateString.split(",")[0].split("/");
    const day = parseInt(dateParts[0]);
    const monthIndex = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);
  
    const suffix =
      day === 1 || day === 21 || day === 31 ? "st" :
      day === 2 || day === 22 ? "nd" :
      day === 3 || day === 23 ? "rd" : "th";
  
    return `${months[monthIndex]} ${day}${suffix}, ${year}`;
  };

  return (
    <div>
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
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs border">
                      {/* {order?.data?.updatedAt || order?.data?.createdAt} */}
                      {order?.data?.createdAt
                        ? formatDate(order?.data?.createdAt)
                        : ""}
                      {/* {formatDate(order?.data?.updatedAt || order?.data?.createdAt) || "N/A"} */}
                    </td>
                    <td className="px-4 py-2 text-xs border">
                      {order?.data?.price
                        ? order.data.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: order.data.currency || "NGN", // Fallback to USD if currency is missing
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
                              setTailorInfo({ ...tailorInfo, id: order?.id });
                              setAddingTailor(true);
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
            />
          )}

          {/* No Results Message */}
          {filteredOrders?.length === 0 && (
            <p className="mt-4 text-gray-500 text-xs">
              No orders match your filter and search.
            </p>
          )}
        </div>
      )}
      <AddTailorModal
        isOpen={addingTailor}
        onClose={() => setAddingTailor(false)}
        onSubmit={handleAddTailor}
        tailorInfo={tailorInfo}
        setTailorInfo={setTailorInfo}
      />
    </div>
  );
}

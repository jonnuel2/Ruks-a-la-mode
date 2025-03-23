import { useEffect, useState } from "react";
import OrderDetails from "./order-details";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addTailor, getAllOrders, updateOrder } from "@/helpers/api-controller";
import { Audio } from "react-loader-spinner";
import AddTailorModal from "./add-tailor";

type Order = {
  id: string;
  email: string;
  createdAt: string;
  status: string; // e.g., "Pending", "Completed", "Cancelled"
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
  const itemsPerPage = 5;

  const orders = allOrders?.orders;

  // const [isLoading, setIsLoading] = useState(false); // Loading state

  const filteredOrders = orders
    ?.filter((order: any) =>
      filter.toLowerCase() === "all"
        ? true
        : order?.data?.status?.toLowercase() === filter?.toLowerCase()
    )
    ?.filter(
      (order: any) =>
        order?.data?.shippingInfo?.email
          ?.toLowerCase()
          ?.includes(searchQuery.toLowerCase()) ||
        order?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );

  // Paginate filtered orders
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
    // setOrders((prevOrders) =>
    //   prevOrders.map((order) =>
    //     order.id === id ? { ...order, status: newStatus } : order
    //   )
    // );
  };

  const handleAddTailor = () => {
    addTailorMutation.mutate(tailorInfo);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const [addngTailor, setAddingTailor] = useState(false);

  useEffect(() => {}, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      {/* Filters Section */}
      <div className="mb-4 flex items-center space-x-4">
        {/* Status Filter */}
        <div>
          <label className="mr-2 font-medium lg:text-sm text-xs">
            Filter by Status:
          </label>
          <select
            className="border rounded px-2 py-1 lg:text-sm text-xs"
            value={filter}
            onChange={(e) => setFilter(e.target.value?.toLowerCase())}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Pending">Producing</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex items-center mt-5 lg:mt-0">
          <label className="mr-2 font-medium lg:text-sm text-xs">Search:</label>
          <input
            type="text"
            className="border rounded px-2 py-1 lg:w-64 lg:text-sm text-xs"
            placeholder="Search by customer or order ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center my-4">
          <Audio />
        </div>
      ) : (
        <div>
          {/* Orders Table */}
          <table className="min-w-full table-auto bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border lg:text-sm text-xs">
                  Order ID
                </th>
                <th className="px-4 py-2 border lg:text-sm text-xs">
                  Customer
                </th>
                <th className="px-4 py-2 border lg:text-sm text-xs">Date</th>
                <th className="px-4 py-2 border lg:text-sm text-xs">Total</th>
                <th className="px-4 py-2 border lg:text-sm text-xs">Status</th>
                <th className="px-4 py-2 border lg:text-sm text-xs">
                  Discount
                </th>
                <th className="px-4 py-2 border lg:text-sm text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders?.map((order: any) => (
                <tr key={order.id}>
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
                    {order?.data?.createdAt}
                  </td>
                  <td className="px-4 py-2 text-xs border">
                    {order?.data?.price}
                  </td>
                  <td className="px-4 py-2 text-xs border">
                    <span
                      className={`px-2 py-1 rounded capitalize ${
                        order?.data?.status === "producing"
                          ? "text-yellow-500"
                          : order?.data?.status === "ready"
                          ? "text-green-500"
                          : order?.data?.status === "delivered"
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {order?.data?.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs border">
                    {order?.data?.discount}
                  </td>
                  <td className="">
                    <div className="ml-2 flex lg:flex-row flex-col lg:space-y-0 space-y-1 lg:space-x-2 space-x-0">
                      {order?.data?.status === "pending" && (
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded lg:text-xs text-[10px]"
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
                          className="bg-green-500 text-white px-2 py-1 rounded lg:text-xs text-[10px]"
                          onClick={() => handleStatusChange(order.id, "ready")}
                        >
                          Ready
                        </button>
                      )}
                      {order?.data?.status === "producing" ||
                        (order?.data?.status === "pending" && (
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded lg:text-xs text-[10px]"
                            onClick={() =>
                              handleStatusChange(order.id, "canceled")
                            }
                          >
                            Cancel
                          </button>
                        ))}

                      <button
                        onClick={() => handleViewDetails(order)}
                        className={`bg-blue-500 text-white px-2 py-1 rounded lg:text-xs text-[10px] ${
                          order.status === "ready" ? "" : ""
                        }`}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 text-xs"
            >
              Previous
            </button>
            <span className=" text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-xs text-gray-700 px-4 py-2 rounded disabled:opacity-50"
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
        isOpen={addngTailor}
        onClose={() => setAddingTailor(false)}
        onSubmit={handleAddTailor}
        tailorInfo={tailorInfo}
        setTailorInfo={setTailorInfo}
      />
    </div>
  );
}

import { useState } from "react";
import AddDiscountModal from "./add-discount";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createDiscount,
  deleteDiscount,
  getDiscounts,
} from "@/helpers/api-controller";
import { DateTime } from "luxon";

interface DiscountInfo {
  code: string;
  rate: number | string;
  count: number | string;
  duration: number | string;
}

export default function DiscountCodes() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = DateTime.now();

  const {
    data: discountsData,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["discounts"],
    queryFn: () => getDiscounts(),
  });

  const discounts = discountsData?.discounts;

  const createDiscountMutation = useMutation({
    mutationFn: (data: any) => createDiscount(data),
    onSuccess: () => refetch(),
  });

  const deleteDiscountMutation = useMutation({
    mutationFn: (code: any) => deleteDiscount(code),
    onSuccess: () => refetch(),
  });

  const [newDiscount, setNewDiscount] = useState<DiscountInfo>({
    code: "",
    rate: "",
    count: "",
    duration: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Pagination logic
  const totalPages = Math.ceil(discounts?.length / itemsPerPage);
  const displayedDiscounts = discounts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteDiscount = (code: string) => {
    deleteDiscountMutation.mutate(code);
  };

  const handleSubmitDiscount = () => {
    let _discount: any = { ...newDiscount };
    _discount.count = parseInt(_discount.count);
    _discount.rate = parseInt(_discount.rate);
    createDiscountMutation.mutate(_discount);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Discounts Management</h2>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className={`px-4 py-2 rounded text-sm bg-blue-500 text-white`}
        >
          Add Discount
        </button>
      </div>

      {/* Discounts Table */}
      <table className="min-w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border text-sm">Code</th>
            <th className="px-4 py-2 border text-sm">Rate</th>
            <th className="px-4 py-2 border text-sm">Count</th>
            <th className="px-4 py-2 border text-sm">Duration</th>
            <th className="px-4 py-2 border text-sm">Status</th>
            <th className="px-4 py-2 border text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedDiscounts?.map((discount: any) => (
            <tr key={discount?.id}>
              <td className="px-4 py-2 border text-center text-xs">
                {discount?.id}
              </td>
              <td className="px-4 py-2 border text-center text-xs">
                {discount?.data?.rate}
              </td>
              <td className="px-4 py-2 border text-center text-xs">
                {discount?.data?.count}
              </td>
              <td className="px-4 py-2 border text-center text-xs">
                {discount?.data?.duration}
              </td>
              <td className="px-4 py-2 border text-center text-xs">
                {now <
                DateTime.fromISO(discount?.data?.createdAt).plus({
                  hours: discount?.data?.duration,
                })
                  ? "Active"
                  : "Inactive"}
              </td>
              <td className="px-4 py-2 border text-center text-xs">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs mr-2"
                  onClick={() => handleDeleteDiscount(discount?.id)}
                >
                  Delete
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
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <AddDiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitDiscount}
        discountInfo={newDiscount}
        setDiscountInfo={setNewDiscount}
      />
    </div>
  );
}

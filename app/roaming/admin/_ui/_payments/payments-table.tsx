"use client";

import { Payment } from "@/helpers/types";
import React, { useState } from "react";

const PaymentTable = ({
  setSelectedPayment,
}: {
  setSelectedPayment: (value: Payment | null) => void;
}) => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY001",
      customerName: "Jan@gmail.com",
      orderId: "ORD001",
      amount: 129.99,
      method: "Credit Card",
      status: "Successful",
      date: "2025-01-15",
    },
    {
      id: "PAY002",
      customerName: "aneoe@gmail.com",
      orderId: "ORD002",
      amount: 129.99,
      method: "Credit Card",
      status: "Pending",
      date: "2025-01-15",
    },
    {
      id: "PAY003",
      customerName: "neoe@gmail.com",
      orderId: "ORD003",
      amount: 129.99,
      method: "Bank Transfer",
      status: "Pending",
      date: "2025-01-15",
    },
    {
      id: "PAY004",
      customerName: "Jaoe@gmail.com",
      orderId: "ORD004",
      amount: 129.99,
      method: "Credit Card",
      status: "Successful",
      date: "2025-01-15",
    },
    {
      id: "PAY005",
      customerName: "JDonn@gmail.com",
      orderId: "ORD005",
      amount: 129.99,
      method: "Debiti Card",
      status: "Successful",
      date: "2025-01-15",
    },
  ]);

  const [filteredPayments, setFilteredPayments] = useState(payments);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleSearch = () => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((payment) => payment.status === filterStatus);
    }

    if (filterMethod) {
      filtered = filtered.filter((payment) => payment.method === filterMethod);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to the first page on filter or search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusChange = (paymentId: string, newStatus: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      )
    );
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payments Management</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by ID or Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Methods</option>
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterStatus("");
            setFilterMethod("");
            setFilteredPayments(payments);
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {/* Payment Table */}
      <table className="min-w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Payment ID</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Method</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-4 py-2 border">{payment.id}</td>
              <td className="px-4 py-2 border">{payment.customerName}</td>
              <td className="px-4 py-2 border">{payment.orderId}</td>
              <td className="px-4 py-2 border">${payment.amount.toFixed(2)}</td>
              <td className="px-4 py-2 border">{payment.method}</td>
              <td className="px-4 py-2 border">
                <select
                  value={payment.status}
                  onChange={(e) =>
                    handleStatusChange(payment.id, e.target.value)
                  }
                  className="border rounded p-1"
                >
                  <option value="Successful">Successful</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleViewDetails(payment)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredPayments.length / pageSize)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(filteredPayments.length / pageSize)
          }
          className={`px-4 py-2 rounded ${
            currentPage === Math.ceil(filteredPayments.length / pageSize)
              ? "bg-gray-300"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentTable;

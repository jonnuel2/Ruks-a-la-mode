"use client"

import { getDeliveries, updateOrder } from "@/helpers/api-controller"
import type { Delivery } from "@/helpers/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect, useCallback, useMemo } from "react"
import DeliveryInfoModal from "./delivery-info"
import emailjs from "@emailjs/browser"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

dayjs.extend(customParseFormat)

const Deliveries = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMessageSending, setIsMessageSending] = useState(false)

  // State management
  const [sortField, setSortField] = useState<"date" | "name">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filter, setFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 5

  const { data: deliveriesData, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getDeliveries,
    staleTime: 0,
  })

  // Delivery info state
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
      phonenumber: "",
    },
    trackingId: "",
    items: [],
  })

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = {
      ready: 0,
      transit: 0,
      delivered: 0,
      canceled: 0,
    }

    deliveriesData?.deliveries?.forEach((delivery: any) => {
      const status = (delivery?.data?.status || "").toLowerCase()
      if (status in counts) {
        counts[status as keyof typeof counts]++
      }
    })

    return counts
  }, [deliveriesData])

  // Update order mutation with optimistic updates
  const updateOrderStatusMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] })
      
      const previousDeliveries = queryClient.getQueryData(["orders"])
      
      queryClient.setQueryData(["orders"], (old: any) => {
        if (!old) return old
        
        return {
          ...old,
          deliveries: old.deliveries.map((delivery: any) => 
            delivery.id === variables.id
              ? {
                  ...delivery,
                  data: {
                    ...delivery.data,
                    status: variables.status,
                    updatedAt: new Date().toISOString()
                  }
                }
              : delivery
          )
        }
      })

      return { previousDeliveries }
    },
    onSuccess: (data, variables) => {
      toast.success(`Status updated to ${variables.status}`)
      if (variables.status === "transit") {
        sendEmail()
      }
    },
    onError: (error, variables, context) => {
      toast.error(`Failed to update status: ${error.message}`)
      queryClient.setQueryData(["orders"], context?.previousDeliveries)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    }
  })

  // Format price as currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(Number.parseInt(amount || "0"))
  }

  const getMeasurementString = (measurement: any) => {
    if (!measurement) return null
    
    // Check for direct size property first
    if (measurement.size) {
      return measurement.size
    }

    // Check for custom measurements
    if (measurement.custom && typeof measurement.custom === "object") {
      const entries = Object.entries(measurement.custom)
      if (entries.length > 0) {
        return entries.map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`).join(", ")
      }
    }

    // Check for direct measurements (like length, width, etc.)
    const standardMeasurements = Object.entries(measurement)
      .filter(([key]) => !["custom"].includes(key))
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)

    if (standardMeasurements.length > 0) {
      return standardMeasurements.join(", ")
    }

    return null
  }

  // Email template with length included
  const orderItemsHTML = deliveryInfo?.items
    ?.map((item: any) => {
      const measurement = getMeasurementString(item.item?.measurement)
      const color = item.item?.color?.name || item?.color?.name
      const length = item.item?.measurement?.length || "N/A"

      return `
          <tr>
            <td>${item.item?.name || "N/A"}</td>
            <td>${measurement || "One Size"}</td>
            <td>${length}</td>
            <td>${color || "Standard"}</td>
            <td>${item.quantity || 1}</td>
            <td>${item.item?.price ? formatCurrency(item.item.price) : "N/A"}</td>
          </tr>
        `
    })
    .join("")

  const templateParams = {
    user_name: `${deliveryInfo?.shippingInfo?.firstname} ${deliveryInfo?.shippingInfo?.surname}`,
    customer_email: deliveryInfo?.shippingInfo?.email,
    customer_phone: deliveryInfo?.shippingInfo?.phonenumber,
    delivery_id: deliveryInfo?.id,
    delivery_date: deliveryInfo?.deliveryDate,
    tracking_id: deliveryInfo?.trackingId,
    delivery_address: [
      deliveryInfo?.shippingInfo?.address,
      deliveryInfo?.shippingInfo?.city,
      deliveryInfo?.shippingInfo?.country
    ].filter(Boolean).join(" "),
    order_items: orderItemsHTML,
    to_mail: deliveryInfo?.shippingInfo?.email,
  }

  const sendEmail = async () => {
    setIsMessageSending(true)
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAIL_JS_DELIVERY_TEMPLATE_ID ?? "",
        templateParams,
        { publicKey: process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY }
      )
      toast.success("Delivery email sent successfully")
    } catch (error) {
      toast.error("Failed to send delivery email")
      console.error("Email send failed:", error)
    } finally {
      setIsMessageSending(false)
    }
  }

  // Processed deliveries with filtering and sorting
  const processedDeliveries = useMemo(() => {
    if (!deliveriesData?.deliveries) return []

    return [...deliveriesData.deliveries]
      .filter((delivery) => {
        const deliveryStatus = (delivery.data?.status || "").toLowerCase()
        const filterStatus = filter.toLowerCase()
        const statusMatches = !filter || filter === "all" || deliveryStatus === filterStatus

        const searchTerm = searchQuery.toLowerCase()
        const fullname = `${delivery.data?.shippingInfo?.firstname} ${delivery.data?.shippingInfo?.surname}`.toLowerCase()
        const matchesSearch = 
          fullname.includes(searchTerm) ||
          delivery.id.toLowerCase().includes(searchTerm) ||
          delivery.data?.shippingInfo?.email?.toLowerCase().includes(searchTerm)

        return statusMatches && matchesSearch
      })
      .sort((a, b) => {
        if (sortField === "date") {
          const dateA = dayjs(a.data?.createdAt)
          const dateB = dayjs(b.data?.createdAt)
          return sortDirection === "asc" ? dateA.diff(dateB) : dateB.diff(dateA)
        } else {
          const nameA = `${a.data?.shippingInfo?.firstname} ${a.data?.shippingInfo?.surname}`.toLowerCase()
          const nameB = `${b.data?.shippingInfo?.firstname} ${b.data?.shippingInfo?.surname}`.toLowerCase()
          return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
        }
      })
  }, [deliveriesData, filter, searchQuery, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(processedDeliveries.length / itemsPerPage)
  const displayedDeliveries = processedDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Action handlers
  const updateStatus = useCallback((id: string, status: Delivery["status"]) => {
    updateOrderStatusMutation.mutate({ id, status })
  }, [updateOrderStatusMutation])

  const handleDeliverySubmit = useCallback(() => {
    updateStatus(deliveryInfo.id, deliveryInfo.status)
    setIsModalOpen(false)
  }, [deliveryInfo, updateStatus])

  const getStatusButton = useCallback((delivery: any) => {
    const status = (delivery.data?.status || "").toLowerCase()
    
    switch (status) {
      case "ready":
        return {
          text: "Mark In Transit",
          action: () => {
            setDeliveryInfo({
              id: delivery.id,
              status: "transit",
              shippingInfo: delivery.data.shippingInfo,
              items: delivery.data.items,
              deliveryDate: "",
              trackingId: "",
            })
            setIsModalOpen(true)
          },
          className: "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-nowrap text-sm"
        }
      case "transit":
        return {
          text: "Mark Delivered",
          action: () => updateStatus(delivery.id, "delivered"),
          className: "bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-nowrap text-sm"
        }
      case "delivered":
        return {
          text: "Delivered",
          action: () => {},
          className: "bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-nowrap text-sm cursor-not-allowed"
        }
      default:
        return {
          text: "Update Status",
          action: () => {},
          className: "bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-nowrap text-sm cursor-not-allowed"
        }
    }
  }, [updateStatus])

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-2xl font-bold mb-6">Delivery Management</h1>
      
      {/* Controls Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div>
            <label className="mr-2 font-medium text-sm">Filter by Status:</label>
            <select
              className="border rounded px-3 py-1.5 text-sm"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value.toLowerCase())
                setCurrentPage(1)
              }}
            >
              <option value="all">All Statuses</option>
              {["Ready", "Transit", "Delivered", "Canceled"].map((status) => (
                <option key={status} value={status.toLowerCase()}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mr-2 font-medium text-sm">Sort by:</label>
            <select
              className="border rounded px-3 py-1.5 text-sm"
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-") as ["date" | "name", "asc" | "desc"]
                setSortField(field)
                setSortDirection(direction)
                setCurrentPage(1)
              }}
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search deliveries..."
          className="border rounded px-3 py-1.5 text-sm flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              filter === status ? "ring-2 ring-blue-500" : ""
            } ${
              status === "ready" ? "bg-yellow-50" :
              status === "transit" ? "bg-blue-50" :
              status === "delivered" ? "bg-green-50" :
              "bg-red-50"
            }`}
            onClick={() => setFilter(filter === status ? "all" : status)}
          >
            <div className="text-sm font-medium capitalize">{status}</div>
            <div className="text-xl font-bold">{count}</div>
          </div>
        ))}
      </div>

      {/* Deliveries Table */}
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortField("name")
                  setSortDirection(prev => prev === "asc" ? "desc" : "asc")
                }}
              >
                Customer {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Info</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSortField("date")
                  setSortDirection(prev => prev === "asc" ? "desc" : "asc")
                }}
              >
                Date {sortField === "date" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedDeliveries.length > 0 ? (
              displayedDeliveries.map((delivery: any) => {
                const statusButton = getStatusButton(delivery)
                return (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{delivery.id}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">
                        {delivery.data.shippingInfo.firstname} {delivery.data.shippingInfo.surname}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {delivery.data.shippingInfo.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>{delivery.data.shippingInfo.address}</div>
                        <div>{delivery.data.shippingInfo.city}, {delivery.data.shippingInfo.state}</div>
                        <div>{delivery.data.shippingInfo.country}</div>
                        <div>{delivery.data.shippingInfo.phonenumber}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {delivery.data.items.map((item: any, index: number) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div className="font-medium">{item.item.name}</div>
                          <div>Qty: {item.quantity}</div>
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {delivery.data.items.map((item: any, index: number) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div><span className="font-semibold">Size:</span> {item.item.measurement?.size || "N/A"}</div>
                          <div><span className="font-semibold">Color:</span> {item.item.color?.name || "N/A"}</div>
                          <div><span className="font-semibold">Price:</span> {formatCurrency(item.item.price)}</div>
                          <div><span className="font-semibold">Length:</span> {item.item.measurement?.length || "N/A"}</div>
                          {item.item.measurement?.custom && (
                            <div><span className="font-semibold">Measurements:</span> {getMeasurementString(item.item.measurement)}</div>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {dayjs(delivery.data.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        delivery.data.status === "ready" ? "bg-yellow-100 text-yellow-800" :
                        delivery.data.status === "transit" ? "bg-blue-100 text-blue-800" :
                        delivery.data.status === "delivered" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {delivery.data.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={statusButton.action}
                        className={statusButton.className}
                        disabled={["delivered", "canceled"].includes(delivery.data.status.toLowerCase())}
                      >
                        {statusButton.text}
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  {isLoading ? "Loading deliveries..." : "No deliveries found matching your criteria"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-100 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-100 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <DeliveryInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleDeliverySubmit}
        deliveryInfo={deliveryInfo}
        setDeliveryInfo={setDeliveryInfo}
      />
    </div>
  )
}

export default Deliveries
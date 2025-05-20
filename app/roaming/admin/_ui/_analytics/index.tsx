"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import {
  getTopSellers,
  getAllOrders,
  getAllProducts,
  getExchangeRates,
} from "@/helpers/api-controller";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  // Set default date range to "all time" (very wide range)
  const [dateRange, setDateRange] = useState({
    start: "2000-01-01", // Far in the past
    end: new Date().toISOString().split("T")[0], // Today
  });

  // State for detailed color table
  const [showDetailedTable, setShowDetailedTable] = useState(false);
  const [colorSalesTableData, setColorSalesTableData] = useState<any[]>([]);

  // Fetch data using React Query
  const {
    data: topSellersData,
    isError: isTopSellersError,
    isLoading: isTopSellersLoading,
  } = useQuery({
    queryKey: ["topSellers"],
    queryFn: () => getTopSellers(),
  });

  const {
    data: ordersData,
    isError: isOrdersError,
    isLoading: isOrdersLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(),
  });

  const {
    data: productsData,
    isError: isProductsError,
    isLoading: isProductsLoading,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => getAllProducts(),
  });

  const {
    data: exchangeRatesData,
    isError: isExchangeRatesError,
    isLoading: isExchangeRatesLoading,
  } = useQuery({
    queryKey: ["exchangeRates"],
    queryFn: () => getExchangeRates(),
  });

  // Process top sellers data for pie chart
  const [productPerformanceData, setProductPerformanceData] =
    useState<any>(null);
  useEffect(() => {
    if (topSellersData?.success && topSellersData?.topSellers?.length > 0) {
      const topSellers = topSellersData.topSellers.slice(0, 5); // Get top 5 sellers
      setProductPerformanceData({
        labels: topSellers.map((t: any) => t.name),
        datasets: [
          {
            label: "Units Sold",
            data: topSellers.map((t: any) => t.sold),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(75, 192, 192, 0.6)",
            ],
          },
        ],
      });
    }
  }, [topSellersData]);

  // Process orders data for sales chart
  const [salesData, setSalesData] = useState<any>(null);
  useEffect(() => {
    if (!ordersData?.success || !ordersData?.orders?.length) return;

    try {
      const orders = ordersData.orders;

      // Filter orders by date range
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      const filteredOrders = orders.filter((order: any) => {
        try {
          // Parse the createdAt date from format "31/03/2025, 11:48"
          const dateParts = order.data.createdAt.split(", ")[0].split("/");
          const orderDate = new Date(
            `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
          );
          return orderDate >= startDate && orderDate <= endDate;
        } catch (e) {
          console.error("Error parsing date:", order.data.createdAt);
          return false;
        }
      });

      // Group orders by month
      const monthlyData: { [key: string]: number } = {};
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      filteredOrders.forEach((order: any) => {
        try {
          // Parse the createdAt date from format "31/03/2025, 11:48"
          const dateParts = order.data.createdAt.split(", ")[0].split("/");
          const date = new Date(
            `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
          );
          const monthName = months[date.getMonth()];

          if (!monthlyData[monthName]) {
            monthlyData[monthName] = 0;
          }

          monthlyData[monthName] += order.data.price || 0;
        } catch (e) {
          console.error("Error processing order date:", order.data.createdAt);
        }
      });

      // Create chart data
      const labels = Object.keys(monthlyData);
      const data = Object.values(monthlyData);

      setSalesData({
        labels,
        datasets: [
          {
            label: "Sales (₦)",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderRadius: 5,
            barThickness: 40,
          },
        ],
      });
    } catch (error) {
      console.error("Error processing sales data:", error);
    }
  }, [ordersData, dateRange]);

  // Process products and orders data for color variant sales
  const [colorChartData, setColorChartData] = useState<any>(null);
  useEffect(() => {
    if (!ordersData?.success || !productsData?.success) return;

    try {
      console.log("Processing color variant sales data");

      // Get products and orders from the response
      const products = productsData.products;
      const orders = ordersData.orders;

      if (!products?.length || !orders?.length) {
        console.log("No products or orders data available");
        return;
      }

      // Filter orders by date range
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      const filteredOrders = orders.filter((order: any) => {
        try {
          // Parse the createdAt date from format "31/03/2025, 11:48"
          const dateParts = order.data.createdAt.split(", ")[0].split("/");
          const orderDate = new Date(
            `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
          );
          return orderDate >= startDate && orderDate <= endDate;
        } catch (e) {
          console.error("Error parsing date:", order.data.createdAt);
          return false;
        }
      });

      // Create a map of product IDs to their details
      const productMap = new Map();

      // Create a map of color names to their hex codes
      const colorHexMap = new Map();

      // Process products to build the product map and collect color information
      products.forEach((product: any) => {
        if (product && product.id) {
          // Store product details
          productMap.set(product.id, {
            id: product.id,
            name: product.data.name,
            colors: product.data.colors || [],
            sold: product.data.sold || 0,
          });

          // Store color hex codes
          if (product.data.colors && Array.isArray(product.data.colors)) {
            product.data.colors.forEach((color: any) => {
              if (color.name && color.hexCode) {
                colorHexMap.set(color.name, color.hexCode);
              }
            });
          }
        }
      });

      // Extract order items and group by product and color
      const designColorSales: { [key: string]: { [key: string]: number } } = {};

      // Also track color hex codes from orders
      filteredOrders.forEach((order: any) => {
        // Skip if order has no items or is canceled
        if (
          !order.data.items ||
          !Array.isArray(order.data.items) ||
          order.data.status === "canceled"
        )
          return;

        // Process each item in the order
        order.data.items.forEach((itemData: any) => {
          const item = itemData.item;
          // Skip if item has no ID
          if (!item.id) return;

          const product = productMap.get(item.id);
          // Skip if product not found
          if (!product) return;

          const designName = product.name || item.name || "Unknown Product";
          const colorName = item.color?.name || "Default";
          const colorHex = item.color?.hexCode;
          const quantity = Number.parseInt(itemData.quantity) || 1;

          // Store color hex code if available
          if (colorName && colorHex) {
            colorHexMap.set(colorName, colorHex);
          }

          // Initialize design if not exists
          if (!designColorSales[designName]) {
            designColorSales[designName] = {};
          }

          // Initialize color if not exists
          if (!designColorSales[designName][colorName]) {
            designColorSales[designName][colorName] = 0;
          }

          // Add quantity
          designColorSales[designName][colorName] += quantity;
        });
      });

      console.log("Processed design color sales:", designColorSales);
      console.log("Color hex map:", Object.fromEntries(colorHexMap));

      // Get all designs sorted by total sales (for chart display)
      const designTotalSales = Object.entries(designColorSales).map(
        ([design, colors]) => {
          const totalSold = Object.values(colors).reduce(
            (sum, qty) => sum + qty,
            0
          );
          return { design, totalSold };
        }
      );

      // Sort designs by total sold (descending)
      const sortedDesigns = designTotalSales
        .sort((a, b) => b.totalSold - a.totalSold)
        .map((item) => item.design);

      // Get all unique colors across all designs
      const allColors = new Set<string>();
      Object.keys(designColorSales).forEach((design) => {
        Object.keys(designColorSales[design]).forEach((color) => {
          allColors.add(color);
        });
      });

      // Create color map with actual hex codes
      const colorArray = Array.from(allColors);
      const colorMap: Record<string, string> = {};

      // Fallback colors in case hex codes are missing
      const fallbackColors = [
        "rgba(255, 99, 132, 0.8)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(255, 159, 64, 0.8)",
        "rgba(201, 203, 207, 0.8)",
      ];

      // Function to convert hex to rgba with opacity
      const hexToRgba = (hex: string, opacity = 0.8) => {
        // Remove # if present
        hex = hex.replace("#", "");

        // Handle shorthand hex (e.g., #FFF)
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }

        // Handle hex with spaces
        hex = hex.trim();

        // Parse hex values
        const r = Number.parseInt(hex.substring(0, 2), 16);
        const g = Number.parseInt(hex.substring(2, 4), 16);
        const b = Number.parseInt(hex.substring(4, 6), 16);

        // Check if parsing was successful
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
          return null;
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      };

      // Assign colors based on hex codes or fallback
      colorArray.forEach((color, index) => {
        const hexCode = colorHexMap.get(color);
        if (hexCode) {
          const rgbaColor = hexToRgba(hexCode);
          if (rgbaColor) {
            colorMap[color] = rgbaColor;
          } else {
            colorMap[color] = fallbackColors[index % fallbackColors.length];
          }
        } else {
          colorMap[color] = fallbackColors[index % fallbackColors.length];
        }
      });

      // Create datasets for each color
      const datasets = colorArray.map((color) => ({
        label: color,
        data: sortedDesigns.map(
          (design) => designColorSales[design][color] || 0
        ),
        backgroundColor: colorMap[color],
      }));

      // Set chart data - use all designs but limit to a reasonable number for display
      // We'll show all designs in the detailed table
      const maxDesignsToShow = 15; // Show top 10 designs in chart for readability
      setColorChartData({
        labels: sortedDesigns.slice(0, maxDesignsToShow),
        datasets: datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.slice(0, maxDesignsToShow),
        })),
      });

      console.log("Chart data prepared:", {
        labels: sortedDesigns.slice(0, maxDesignsToShow),
        datasets: datasets.map((d) => ({
          label: d.label,
          data: d.data.slice(0, maxDesignsToShow),
          backgroundColor: d.backgroundColor,
        })),
      });

      // Prepare data for detailed table (all designs)
      const tableData = Object.entries(designColorSales).map(
        ([design, colors]) => {
          const colorEntries = Object.entries(colors);
          const totalSold = colorEntries.reduce(
            (sum, [_, qty]) => sum + qty,
            0
          );
          const colorCount = colorEntries.length;

          return {
            design,
            colorCount,
            totalSold,
            colors: colorEntries.map(([colorName, qty]) => {
              const hexCode = colorHexMap.get(colorName);
              return {
                color: colorName,
                qty,
                hexCode: hexCode || null,
              };
            }),
          };
        }
      );

      // Sort by total sold (descending)
      tableData.sort((a, b) => b.totalSold - a.totalSold);
      setColorSalesTableData(tableData);
    } catch (error) {
      console.error("Error processing color variant data:", error);
    }
  }, [productsData, ordersData, dateRange]);

  // Calculate exchange rate for display
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  useEffect(() => {
    if (exchangeRatesData?.ngn) {
      // Get USD to NGN rate
      const usdRate = exchangeRatesData.ngn.usd
        ? 1 / exchangeRatesData.ngn.usd
        : null;
      setExchangeRate(usdRate);
    }
  }, [exchangeRatesData]);

  // Handle date range change
  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  // Reset date range to all time
  const resetDateRange = () => {
    setDateRange({
      start: "2000-01-01",
      end: new Date().toISOString().split("T")[0],
    });
  };

  // Loading state for all data
  const isLoading =
    isTopSellersLoading ||
    isOrdersLoading ||
    isProductsLoading ||
    isExchangeRatesLoading;
  const hasError =
    isTopSellersError ||
    isOrdersError ||
    isProductsError ||
    isExchangeRatesError;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>

      {/* Date Range Filter */}
      <div className="mb-8 flex gap-6 flex-wrap items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateRangeChange("start", e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateRangeChange("end", e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <button
          onClick={resetDateRange}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Show All Time
        </button>
        {exchangeRate && (
          <div className="ml-auto">
            <div className="bg-green-50 border border-green-200 rounded px-4 py-2">
              <span className="text-sm text-green-800">
                Current USD/NGN Rate:{" "}
              </span>
              <span className="font-semibold text-green-800">
                ₦{exchangeRate.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">
            Please check your network connection and try again.
          </p>
        </div>
      )}

      {/* Main Charts Grid */}
      {!isLoading && !hasError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status Summary - MOVED TO TOP */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-xl font-semibold mb-4">Order Status Summary</h3>
            {ordersData?.success && ordersData?.orders?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { status: "delivered", color: "blue" },
                  { status: "ready", color: "green" },
                  { status: "producing", color: "yellow" },
                  { status: "canceled", color: "red" },
                  { status: "pending", color: "orange" },
                  { status: "delivered", color: "gray" },
                ].map((statusInfo) => {
                  // Filter orders by date range
                  const startDate = new Date(dateRange.start);
                  const endDate = new Date(dateRange.end);

                  const count = ordersData.orders.filter((order: any) => {
                    try {
                      // Check status match
                      if (
                        order.data.status?.toLowerCase() !==
                        statusInfo.status.toLowerCase()
                      )
                        return false;

                      // Check date range
                      const dateParts = order.data.createdAt
                        .split(", ")[0]
                        .split("/");
                      const orderDate = new Date(
                        `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
                      );
                      return orderDate >= startDate && orderDate <= endDate;
                    } catch (e) {
                      return false;
                    }
                  }).length;

                  // Define background and text colors based on status
                  let bgColor = "bg-gray-50";
                  let textColor = "text-gray-700";

                  switch (statusInfo.color) {
                    case "blue":
                      bgColor = "bg-blue-50";
                      textColor = "text-blue-700";
                      break;
                    case "green":
                      bgColor = "bg-green-50";
                      textColor = "text-green-700";
                      break;
                    case "yellow":
                      bgColor = "bg-yellow-50";
                      textColor = "text-yellow-700";
                      break;
                    case "red":
                      bgColor = "bg-red-50";
                      textColor = "text-red-700";
                      break;
                    case "orange":
                      bgColor = "bg-orange-50";
                      textColor = "text-orange-700";
                      break;
                  }

                  return (
                    <div
                      key={statusInfo.status}
                      className={`${bgColor} rounded-lg p-4 text-center`}
                    >
                      <p className={`${textColor} text-sm capitalize`}>
                        {statusInfo.status}
                      </p>
                      <p className={`text-2xl font-bold ${textColor}`}>
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                No order status data available
              </p>
            )}
          </div>

          {/* Revenue Summary - MOVED TO TOP */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-xl font-semibold mb-4">Revenue Summary</h3>
            {ordersData?.success && ordersData?.orders?.length > 0 ? (
              <div className="space-y-4">
                {(() => {
                  const orders = ordersData.orders;

                  // Calculate total revenue for all time
                  const totalRevenue = orders.reduce(
                    (sum: number, order: any) => sum + (order.data.price || 0),
                    0
                  );

                  // Calculate revenue in selected date range
                  const startDate = new Date(dateRange.start);
                  const endDate = new Date(dateRange.end);

                  const periodRevenue = orders
                    .filter((order: any) => {
                      try {
                        // Parse the createdAt date from format "31/03/2025, 11:48"
                        const dateParts = order.data.createdAt
                          .split(", ")[0]
                          .split("/");
                        const orderDate = new Date(
                          `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
                        );
                        return orderDate >= startDate && orderDate <= endDate;
                      } catch (e) {
                        return false;
                      }
                    })
                    .reduce(
                      (sum: number, order: any) =>
                        sum + (order.data.price || 0),
                      0
                    );

                  return (
                    <>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-600">
                          Total Revenue (All Time)
                        </span>
                        <span className="text-xl font-bold">
                          ₦{totalRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-600">
                          Revenue (Selected Period)
                        </span>
                        <span className="text-xl font-bold">
                          ₦{periodRevenue.toLocaleString()}
                        </span>
                      </div>
                      {exchangeRate && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Revenue in USD (Selected Period)
                          </span>
                          <span className="text-xl font-bold">
                            ${(periodRevenue / exchangeRate).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                No revenue data available
              </p>
            )}
          </div>
          {/* Sales Overview */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
            {salesData ? (
              <Bar
                data={salesData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          let label = context.dataset.label || "";
                          if (label) {
                            label += ": ";
                          }
                          if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat("en-NG", {
                              style: "currency",
                              currency: "NGN",
                            }).format(context.parsed.y);
                          }
                          return label;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => "₦" + value.toLocaleString(),
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500 py-12">
                No sales data available for the selected period
              </p>
            )}
          </div>

          {/* Product Performance */}
          <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">
              Top Product Performance
            </h3>
            {productPerformanceData ? (
              <div className="w-64 h-64">
                <Pie
                  data={productPerformanceData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || "";
                            const value = context.raw as number;
                            const total = context.dataset.data.reduce(
                              (a: number, b: number) => a + b,
                              0
                            );
                            const percentage = Math.round(
                              (value / total) * 100
                            );
                            return `${label}: ${value} units (${percentage}%)`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                No product performance data available
              </p>
            )}
          </div>

          {/* Color Variant Sales by Design - MOVED BELOW */}
          <div className="bg-white rounded-lg p-4 shadow col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Color Variant Sales by Design
              </h3>
              <button
                onClick={() => setShowDetailedTable(!showDetailedTable)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                {showDetailedTable ? "Hide Details" : "Show All Designs"}
              </button>
            </div>

            <div className="w-full overflow-x-auto">
              {colorChartData ? (
                <>
                  <Bar
                    data={colorChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                          title: {
                            display: true,
                            text: "Color Variants",
                            font: {
                              weight: "bold",
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.dataset.label || "";
                              const value = context.parsed.y;
                              return `${label}: ${value} units sold`;
                            },
                            title: (context) => `${context[0].label} (Design)`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: "Units Sold",
                            font: {
                              weight: "bold",
                            },
                          },
                          stacked: true,
                        },
                        x: {
                          stacked: true,
                          title: {
                            display: true,
                            text: "Product Designs",
                            font: {
                              weight: "bold",
                            },
                          },
                        },
                      },
                    }}
                  />

                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      This chart shows the top 10 selling designs and how many
                      units of each color variant were sold.
                    </p>
                    <p>
                      Each bar represents a product design, and the colored
                      segments show sales by color variant.
                    </p>
                    <p className="mt-2">
                      <strong>Note:</strong> The chart colors match the actual
                      product colors based on their hex codes. Click "Show All
                      Designs" to see a detailed breakdown of all designs.
                    </p>
                  </div>

                  {/* Detailed Color Sales Table */}
                  {showDetailedTable && colorSalesTableData.length > 0 && (
                    <div className="mt-8 overflow-x-auto">
                      <h4 className="text-lg font-medium mb-3">
                        All Designs Color Variant Sales
                      </h4>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Design
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Color Variants
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Sold
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Color Breakdown
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {colorSalesTableData.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.design}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.colorCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.totalSold}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <div className="flex flex-wrap gap-2">
                                  {item.colors.map(
                                    (colorData: any, colorIndex: number) => (
                                      <div
                                        key={colorIndex}
                                        className="flex items-center rounded-full px-3 py-1"
                                        style={{
                                          backgroundColor: colorData.hexCode
                                            ? `${colorData.hexCode}33`
                                            : // 20% opacity version of the color
                                              "rgba(229, 231, 235, 0.5)", // Default light gray
                                          border: `1px solid ${
                                            colorData.hexCode || "#d1d5db"
                                          }`,
                                        }}
                                      >
                                        <span className="mr-2">
                                          {colorData.color}:
                                        </span>
                                        <span className="font-medium">
                                          {colorData.qty}
                                        </span>
                                        {colorData.hexCode && (
                                          <div
                                            className="ml-2 w-3 h-3 rounded-full"
                                            style={{
                                              backgroundColor:
                                                colorData.hexCode,
                                            }}
                                          ></div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-2">
                    No color variant sales data available
                  </p>
                  <p className="text-sm text-gray-400">
                    This could be because there are no orders with color
                    information or the data format is different than expected.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for future analytics */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Customer retention insights</li>
          <li>Daily/weekly order trends</li>
          <li>Geo-demographics & traffic sources</li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;

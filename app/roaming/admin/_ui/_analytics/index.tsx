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
import { getTopSellers } from "@/helpers/api-controller";

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
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Mock data for charts
  const salesData = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 1900, 1700, 2200],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const [productPerformanceData, setProductPerformanceData] =
    useState<any>(undefined);

  const {
    data: topSellersData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["topSellers"],
    queryFn: () => getTopSellers(),
  });

  const topSellers = topSellersData?.topSellers;

  useEffect(() => {
    setProductPerformanceData({
      labels: topSellers?.map((t: any) => t?.name),
      datasets: [
        {
          label: "Units Sold",
          data: topSellers?.map((t: any) => t?.sold),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    });
  }, [topSellers]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>

      {/* Date Range Filter */}
      {/* <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="border px-4 py-2 rounded w-full"
          />
        </div>
      </div> */}

      {/* Sales Overview */}
      {/* <div className="mb-8 lg:w-2/3 mt-16">
        <h3 className="text-xl font-bold mb-4">Sales Overview</h3>
        <Bar data={salesData} />
      </div> */}

      {/* Product Performance */}
      <div className="mb-8 lg:w-2/3">
        <h3 className="text-xl font-bold mb-4">Product Performance</h3>
        {productPerformanceData ? <Pie data={productPerformanceData} /> : <></>}
      </div>

      {/* Traffic Analytics Placeholder */}
      {/* <div>
        <h3 className="text-xl font-bold mb-4">Traffic Analytics</h3>
        <p>Integrate traffic data here (e.g., Google Analytics).</p>
      </div> */}
    </div>
  );
};

export default Analytics;

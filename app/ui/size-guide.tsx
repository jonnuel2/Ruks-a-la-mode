"use client";

import { useState } from "react";

const SizeGuide = ({
  measurement,
  setMeasurement,
}: {
  measurement: any;
  setMeasurement: (value: any) => void;
}) => {
  const sizes = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
  const measurements = {
    bust: [32, 34, 36, 38, 41, 43, 45, 48, 50, 52],
    waist: [25, 27, 30, 32, 34, 36, 38, 40, 42, 44],
    hips: [36, 38, 40, 43, 45, 48, 50, 54, 56, 59],
  };
  const heightCategories = [
    "Petite",
    "Petite+",
    "Average",
    "Average+",
    "Tall",
    "Very Tall",
  ];
  const lengths = {
    "pants/skirt": [42, 43, 45, 47, 49, 52],
    dress: [56, 57, 58, 60, 63, 65],
  };

  const lengthCategory = Object.keys(lengths);

  const handleSizeClick = (size: number) => {
    setMeasurement({
      size,
      bust: null,
      waist: null,
      hips: null,
      heightCategory: measurement.heightCategory,
      length: measurement.length,
    });
  };

  const handleMeasurementClick = (
    type: "bust" | "waist" | "hips",
    value: number
  ) => {
    setMeasurement((prev: any) => ({
      ...prev,
      size: null,
      [type]: value,
    }));
  };

  const handleLengthClick = (category: string, length: number) => {
    setMeasurement((prev: any) => ({
      ...prev,
      heightCategory: category,
      length,
    }));
  };

  return (
    <div className="py-4 space-y-8 w-full overflow-scroll">
      {/* Size Guide Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Size Guide</h2>
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr>
              <th className="border border-gray-300">Size</th>
              {sizes.map((size) => (
                <th
                  key={size}
                  className={`border border-gray-300 cursor-pointer ${
                    measurement.size === size ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(measurements).map(([key, values]) => {
              // Type guard to ensure `key` is "bust", "waist", or "hips"
              if (!["bust", "waist", "hips"].includes(key)) return null;

              return (
                <tr key={key}>
                  <td className="border border-gray-300 font-bold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </td>
                  {values.map((value, index) => (
                    <td
                      key={index}
                      className={`border border-gray-300 cursor-pointer ${
                        measurement[key as "bust" | "waist" | "hips"] === value
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                      onClick={() =>
                        handleMeasurementClick(
                          key as "bust" | "waist" | "hips",
                          value
                        )
                      }
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Length Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Length Guide</h2>
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr>
              <th className="border border-gray-300">Height</th>
              {heightCategories.map((category) => (
                <th key={category} className="border border-gray-300 font-bold">
                  {category}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(lengths).map(([type, values]) => (
              <tr key={type}>
                <td className="border border-gray-300 font-bold capitalize">
                  {type}
                </td>
                {values.map((value, index) => (
                  <td
                    key={index}
                    className={`border border-gray-300 cursor-pointer ${
                      measurement.heightCategory === type &&
                      measurement.length === value
                        ? "bg-green-500 text-white"
                        : ""
                    }`}
                    onClick={() => handleLengthClick(type, value)}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Selected Measurements */}
      {/* <div>
        <h3 className="font-bold text-lg">Selected Measurements:</h3>
        <p>
          {measurement.size
            ? `Size: ${measurement.size}`
            : `Bust: ${measurement.bust || "N/A"}, Waist: ${
                measurement.waist || "N/A"
              }, Hips: ${measurement.hips || "N/A"}`}
        </p>
        <p>
          Height Category: {measurement.heightCategory || "N/A"}, Length:{" "}
          {measurement.length || "N/A"}
        </p>
      </div> */}
    </div>
  );
};

export default SizeGuide;

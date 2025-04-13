import React from "react";

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-neutral-50 w-full">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        {/* Elegant header section */}
        <div className="text-center mb-12">
          <h1 className="lg:text-5xl text-4xl tracking-wide  text-gray-900 mb-4">
            Size Guide
          </h1>
          {/* <div className="w-24 h-0.5 bg-amber-700 mx-auto mb-6"></div> */}
          <p className="text-gray-600">
            Precision measurements for the perfect fit
          </p>
        </div>

        {/* Main content container */}
        <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 rounded-sm">
          {/* Size guide table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-6 text-left font-medium text-gray-700">SIZE</th>
                  {[6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((size) => (
                    <th key={size} className="pb-3 px-2 text-center font-medium text-gray-700">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-6 font-medium text-gray-700">BUST</td>
                  {[32, 34, 36, 38, 41, 43, 45, 48, 50, 52].map((measurement) => (
                    <td key={measurement} className="py-4 px-2 text-center">
                      {measurement}"
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-6 font-medium text-gray-700">WAIST</td>
                  {[25, 27, 30, 32, 34, 36, 38, 40, 42, 44].map((measurement) => (
                    <td key={measurement} className="py-4 px-2 text-center">
                      {measurement}"
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-medium text-gray-700">HIPS</td>
                  {[36, 38, 40, 43, 45, 48, 50, 54, 56, 59].map((measurement) => (
                    <td key={measurement} className="py-4 px-2 text-center">
                      {measurement}"
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measurement note */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-start">
              <svg 
                className="w-5 h-5 text-amber-700 mt-0.5 mr-3 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Note:</span> All measurements are in inches. 
                For between sizes, we recommend sizing up for comfort.
              </p>
            </div>
          </div>
        </div>

        {/* Visual fitting guide */}
        <div className="mt-12 bg-white p-6 md:p-8 shadow-sm border border-gray-100 rounded-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">HOW TO MEASURE</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "BUST",
                steps: "Measure around the fullest part of your bust, keeping tape parallel to the floor"
              },
              {
                title: "WAIST",
                steps: "Measure at your natural waistline (typically the narrowest part of your torso)"
              },
              {
                title: "HIPS",
                steps: "Measure around the fullest part of your hips, about 8 inches below your waist"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-amber-50 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-amber-700 font-medium">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{item.steps}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing element */}
        <div className="text-center mt-16">
          <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">
            Need fitting advice? Contact our <span className="text-amber-700 font-medium">style specialists</span>
          </p>
        </div>
      </div>
    </div>
  );
}
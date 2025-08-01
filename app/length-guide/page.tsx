import React from "react";

export default function LengthGuide() {
  return (
    <div className="min-h-screen bg-neutral-50 w-full">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        {/* Elegant header section */}
        <div className="text-center mb-12">
          <h1 className="lg:text-5xl text-4xl tracking-wide text-gray-900 mb-4">
            Length Guide
          </h1>
          {/* <div className="w-24 h-0.5 bg-amber-700 mx-auto mb-6"></div> */}
          <p className="text-gray-600">
            Precise measurements for perfect proportions
          </p>
        </div>

        {/* Main content container */}
        <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100">
          {/* Length guide table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-6 text-left font-medium text-gray-700">
                    HEIGHT
                  </th>
                  <th className="pb-3 px-3 text-center font-medium text-gray-700">
                    PETITE
                    <br />
                    <span className="text-sm">5'0"-5'3"</span>
                  </th>
                  <th className="pb-3 px-3 text-center font-medium text-gray-700">
                    PETITE+
                    <br />
                    <span className="text-sm">5'4"-5'5"</span>
                  </th>
                  <th className="pb-3 px-3 text-center font-medium text-gray-700">
                    AVERAGE
                    <br />
                    <span className="text-sm">5'6"-5'7"</span>
                  </th>
                  <th className="pb-3 px-3 text-center font-medium text-gray-700">
                    AVERAGE+
                    <br />
                    <span className="text-sm">5'8"-5'9"</span>
                  </th>
                  <th className="pb-3 px-3 text-center font-medium text-gray-700">
                    TALL
                    <br />
                    <span className="text-sm">5'10"-5'11"</span>
                  </th>
                  <th className="pb-3 px-3 text-center font-medium text-gray-700">
                    VERY TALL
                    <br />
                    <span className="text-sm">6'+</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 pr-6 font-medium text-gray-700">
                    Pants/Skirt Length
                  </td>
                  <td className="py-4 px-3 text-center">42"</td>
                  <td className="py-4 px-3 text-center">43"</td>
                  <td className="py-4 px-3 text-center">45"</td>
                  <td className="py-4 px-3 text-center">47"</td>
                  <td className="py-4 px-3 text-center">49"</td>
                  <td className="py-4 px-3 text-center">52"</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-medium text-gray-700">
                    Dress Length
                  </td>
                  <td className="py-4 px-3 text-center">56"</td>
                  <td className="py-4 px-3 text-center">57"</td>
                  <td className="py-4 px-3 text-center">58"</td>
                  <td className="py-4 px-3 text-center">60"</td>
                  <td className="py-4 px-3 text-center">63"</td>
                  <td className="py-4 px-3 text-center">65"</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measurement explanation */}
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
                <span className="font-medium">Note:</span> All measurements are
                in inches from waist to hem. For a longer fit, select the next
                height category. Measurements may vary by 0.5" due to fabric
                drape. Not sure of length? Input custom length.
              </p>
            </div>
          </div>
        </div>

        {/* Visual guide */}
        <div className="mt-12 bg-white p-6 md:p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            HOW TO MEASURE LENGTH
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-amber-50 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-amber-700 font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Waist Location</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Find your natural waist (smallest part of torso)
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-50 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-amber-700 font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Measuring Down</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Hold tape straight down to desired hem position
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-50 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-amber-700 font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">
                  Shoe Consideration
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Account for your typical heel height
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing */}
        {/* <div className="text-center mt-16">
          <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">
            "Not sure of length? Input custom length." in notes
            
          </p>
        </div> */}
      </div>
    </div>
  );
}

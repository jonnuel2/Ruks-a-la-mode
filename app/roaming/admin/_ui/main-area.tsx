import React from "react";

const MainArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="lg:ml-64 lg:p-6 w-full">
      <div className="bg-gray-100 p-4 rounded shadow w-full overflow-scroll">
        {children}
      </div>
    </div>
  );
};

export default MainArea;

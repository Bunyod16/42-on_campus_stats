import React from "react";

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="mb-2 bg-gray-600 rounded p-2 text-lg text-gray-100">
      {children}
    </h1>
  );
};

export default CardTitle;

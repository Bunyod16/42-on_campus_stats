import React from "react";

const CardTitle = ({ children }: { children: React.ReactNode }) => {
    return <h1 className="mb-2 rounded bg-gray-600 p-1 text-base 2xl:text-lg 3xl:text-xl font-medium text-gray-100">{children}</h1>;
};

export default CardTitle;

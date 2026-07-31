import React from "react";

const CardTitle = ({ children }: { children: React.ReactNode }) => {
    return <h1 className="card-title-accent mb-2 rounded bg-surface-alt p-1 text-base 2xl:text-lg 3xl:text-xl font-medium text-text-primary text-center">{children}</h1>;
};

export default CardTitle;

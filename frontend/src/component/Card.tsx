import React, { forwardRef } from "react";

interface ICardProps extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode;
    className: string;
}

// * Need interface Card props cuz its more complex

const Card = forwardRef<HTMLDivElement, ICardProps>(({ children, className }: ICardProps, ref) => {
    return (
        <div
            className={"w-full rounded-md bg-gray-700 p-2 text-center align-middle text-gray-200  " + className}
            ref={ref}
        >
            {children}
        </div>
    );
});

export default Card;

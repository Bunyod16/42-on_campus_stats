import React, { forwardRef } from "react";

interface ICardProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className: string;
}

// * Need interface Card props cuz its more complex

const Card = forwardRef<HTMLDivElement, ICardProps>(
  ({ children, className }: ICardProps, ref) => {
    return (
      <div
        className={
          "text-center align-middle bg-gray-700 rounded-xl text-gray-200 border-2 border-teal-500 p-4 " +
          className
        }
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default Card;

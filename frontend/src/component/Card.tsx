import React, { forwardRef } from "react";

interface ICardProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// TODO: Need interface Card props cuz its more complex

const Card = forwardRef<HTMLDivElement, ICardProps>(function Card(
  { children, className }: ICardProps,
  ref
) {
  return (
    <div
      className={
        "text-center align-middle bg-gray-700 rounded-md text-gray-200 p-2 w-full  " +
        className
      }
      ref={ref}
    >
      {children}
    </div>
  );
});

export default Card;

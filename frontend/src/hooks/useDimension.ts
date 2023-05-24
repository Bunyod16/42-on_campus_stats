import React from "react";

export const useDimensions = (myRef: React.RefObject<HTMLDivElement>) => {
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const getDimensions = () => ({
      width: (myRef && myRef.current && myRef.current.offsetWidth) || 0,
      height: (myRef && myRef.current && myRef.current.offsetHeight) || 0,
    });

    const handleResize = () => {
      setDimension(getDimensions());
    };

    if (myRef.current) {
      setDimension(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimension;
};

import React from "react";

export const useDimensions = (myRef: React.RefObject<any>) => {
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const getDimensions = () => ({
      width: (myRef && myRef.current.offsetWidth) || 0,
      height: (myRef && myRef.current.offsetHeight) || 0,
    });

    const handleResize = () => {
      const tempDimensions = getDimensions();
      console.log("temp", tempDimensions);
      if (dimension.width < tempDimensions.width && dimension.height < tempDimensions.height)
        setDimension(tempDimensions);
    };

    if (myRef.current) {
      console.log("current", getDimensions());
      setDimension(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimension;
};

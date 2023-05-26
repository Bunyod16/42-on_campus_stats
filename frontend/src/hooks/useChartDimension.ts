import { ResizeObserver } from "@juggle/resize-observer";
import { useRef, useState, useEffect } from "react";
import { ChartDimension } from "../../types";

const combineChartDimensions = (dimensions: ChartDimension) => {
  const parsedDimensions = {
    ...dimensions,
    height: dimensions.height || 0,
    width: dimensions.width || 0,
    marginTop: dimensions.marginTop || 10,
    marginRight: dimensions.marginRight || 10,
    marginBottom: dimensions.marginBottom || 40,
    marginLeft: dimensions.marginLeft || 75,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};

const useChartDimensions = (passedSettings: ChartDimension) => {
  const ref = useRef<HTMLDivElement>(null);
  const dimension = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  if (dimension.width && dimension.height) return [ref, dimension] as const;
  useEffect(() => {
    if (!ref || !ref.current) return;
    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries: any) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;

      const entry = entries[0];

      if (width != entry.contentRect.width) setWidth(entry.contentRect.width);
      if (height != entry.contentRect.height)
        setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, []);

  const newSettings = combineChartDimensions({
    ...dimension,
    width: dimension.width || width,
    height: dimension.height || height,
  });

  return [ref, newSettings] as const;
};

export default useChartDimensions;

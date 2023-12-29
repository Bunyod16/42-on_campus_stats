import {
  axisBottom,
  axisLeft,
  ScaleBand,
  scaleBand,
  scaleLinear,
  ScaleLinear,
  select,
} from "d3";
import React from "react";
import { useDimensions } from "../hooks/useDimension";
import Card from "./Card";
import CardTitle from "./CardTitle";
import axios from "axios";
interface Data {
  label: string;
  value: number;
}

interface AxisBottomProps {
  scale: ScaleBand<string>;
  transform: string;
}

interface AxisLeftProps {
  scale: ScaleLinear<number, number, never>;
}

interface BarsProps {
  data: IBarChartProps["data"];
  height: number;
  scaleX: AxisBottomProps["scale"];
  scaleY: AxisLeftProps["scale"];
}

interface IBarChartProps {
  data: any[];
  dimension: { width: number; height: number };
}

const tmp = {
  "2023-01-31T00:00:00": 21,
  "2023-02-01T00:00:00": 32,
  "2023-02-02T00:00:00": 33,
  "2023-02-03T00:00:00": 39,
  "2023-02-04T00:00:00": 16,
  "2023-02-05T00:00:00": 16,
  "2023-02-06T00:00:00": 135,
};
function AxisBottom({ scale, transform }: AxisBottomProps) {
  const ref = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisBottom(scale));
    }
  }, [scale]);

  return <g ref={ref} transform={transform} style={{ fontSize: "0.7rem" }} />;
}

function AxisLeft({ scale }: AxisLeftProps) {
  const ref = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisLeft(scale).ticks(5));
    }
  }, [scale]);

  return <g ref={ref} style={{ fontSize: "0.7rem" }} />;
}

function Bars({ data, height, scaleX, scaleY }: BarsProps) {
  return (
    <>
      {data.map(({ value, label }) => (
        <rect
          key={`bar-${label}`}
          x={scaleX(label)}
          y={scaleY(value)}
          width={scaleX.bandwidth()}
          height={height - scaleY(value)}
          fill="#00babc"
        />
      ))}
    </>
  );
}

const BarChart = ({ data, dimension }: IBarChartProps) => {
  const margin = { top: 16, right: 16, bottom: 32, left: 40 };
  const width = dimension.width - margin.left - margin.right;
  const height = dimension.width / 3 - margin.top - margin.bottom;

  const scaleX = scaleBand()
    .domain(data.map(({ label }) => label))
    .range([0, width])
    .padding(0.2);
  const scaleY = scaleLinear()
    .domain([0, Math.max(...data.map(({ value }) => value))])
    .range([height, 0]);

  return (
    <svg width={dimension.width} height={dimension.height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisBottom scale={scaleX} transform={`translate(0, ${height})`} />
        <AxisLeft scale={scaleY} />
        <Bars data={data} height={height} scaleX={scaleX} scaleY={scaleY} />
      </g>
    </svg>
  );
};

interface ITotalActiveUser7Days {
  className?: string;
  dimension: { width: number; height: number };
}
const TotalActiveUser7Days = ({
  className,
  dimension,
}: ITotalActiveUser7Days) => {
  //   const containerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState<any | undefined>(undefined);

  //   const dimension = useDimensions(containerRef);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("/on-campus/daily-total-active-students")
        .then((res) => {
          let data = res.data;
          const newData = Object.keys(data).map((key) => {
            const date = new Date(key).toDateString().split(" ");
            return {
              label: date[1] + " " + date[2],
              value: data[key as keyof typeof data],
            };
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUsers();

    // Call the API every 5 minutes
    const interval = setInterval(fetchUsers, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    // the container for the svg
    <Card className={className + " flex flex-col h-full"}>
      <CardTitle>Total active users last 7 days</CardTitle>
      <div className="w-full h-full flex items-center justify-center">
        {dimension.width !== 0 &&
          dimension.height !== 0 &&
          (data ? (
            <BarChart data={data} dimension={dimension} />
          ) : (
            <div
              className="w-full h-full bg-gray-500 rounded animate-pulse"
              style={{
                width: `${dimension.width}px`,
                height: `${dimension.height}px`,
              }}
            />
          ))}
      </div>
    </Card>
  );
};

export default TotalActiveUser7Days;

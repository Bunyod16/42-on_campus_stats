import React, { useEffect, useRef, useState } from "react";
// import { Card, CardTitle } from "../styles";
import Card from "./Card";
import CardTitle from "./CardTitle";
import * as d3 from "d3";
import "../styles/chart.css";
import { useDimensions } from "../hooks/useDimension";
import axios from "axios";
// turn data object into array of objects
/*
Example :
dataset = [
  {
    project: "ft_container",
    user_num: 3,
    percentage: 0.8
  },
  {
    project: "NetPractice",
    user_num: 1,
    percentage: 0.1
  }
]
*/

// type TDataType = {
//   project: string;
//   user_num: number;
//   percentage: string;
// };

interface User {
  login: string;  // Add other necessary fields
  image: string;
}

// NEW type TDataType
type TDataType = {
  project: string;
  user_num: number;
  percentage: string;
  users: User[]; // Each project should include a users array
};

type TApiDataType = {
  [key: string]: number;
};

// function cleaningData(dataObj: TApiDataType) {
//   let dataset: TDataType[] = [];
//   let tots = 0;
//   for (let d in dataObj) {
//     dataset = [
//       ...dataset,
//       { project: d, user_num: dataObj[d], percentage: "" },
//     ];
//   }
//   dataset = dataset.sort((a, b) => b["user_num"] - a["user_num"]).slice(0, 10);
//   tots = d3.sum(dataset, (d) => d["user_num"]);
//   dataset.forEach((x) => {
//     const floatNum = (x.user_num / tots) * 100;
//     x.percentage = floatNum.toFixed(2) + "%";
//   });
//   return dataset;
// }

// NEW cleaningData function
function cleaningData(dataObj: TApiDataType): TDataType[] {
  let dataset: TDataType[] = [];
  let tots = 0;
  for (let d in dataObj) {
    dataset = [
      ...dataset,
      { project: d, user_num: dataObj[d], percentage: "", users: [] },
    ];
  }
  dataset = dataset.sort((a, b) => b.user_num - a.user_num).slice(0, 10);
  tots = d3.sum(dataset, (d) => d.user_num);
  dataset.forEach((x) => {
    const floatNum = (x.user_num / tots) * 100;
    x.percentage = floatNum.toFixed(2) + "%";
  });
  return dataset;
}

// // Function PieChart Plotting
// function PieChart({
//   projects,
//   color,
//   radius,
//   height,
//   xOffset,
// }: {
//   projects: any;
//   color: Function;
//   radius: number;
//   height: number;
//   xOffset: number;
// }) {
//   const pie = d3.pie().value((d: any) => d["user_num"]);
//   const arc = d3
//     .arc()
//     .innerRadius(0)
//     .outerRadius(radius * 0.9);
//   return (
//     <g transform={"translate(" + xOffset + "," + height / 2 + ")"}>
//       {pie(projects).map((d: any, i) => {
//         return (
//           <g className="arc" key={i}>
//             <path fill={color(i)} d={arc(d)!}></path>
//             <text
//               className="chart-text"
//               transform={`translate(${arc.centroid(d)[0]}, ${
//                 arc.centroid(d)[1]
//               })`}
//             >
//               {d.data.user_num}
//             </text>
//           </g>
//         );
//       })}
//     </g>
//   );
// }

// NEW Function PieChart Plotting
function PieChart({
  projects,
  color,
  radius,
  height,
  xOffset,
}: {
  projects: TDataType[];
  color: Function;
  radius: number;
  height: number;
  xOffset: number;
}) {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  // const pie = d3.pie().value((d: any) => d["user_num"]);
  const pie = d3.pie<TDataType>().value((d) => d.user_num);
  const arc = d3.arc().innerRadius(0).outerRadius(radius * 0.9);

  const handleMouseOver = (event: React.MouseEvent, data: any) => {
    const [x, y] = arc.centroid(data);
    setTooltip({
      visible: true,
      content: `Users: ${data.data.users.map((data: User) => data.login).join(', ')}`,
      x: xOffset + x,
      y: height / 2 + y,
    });
  };

  const handleMouseOut = () => {
    setTooltip({ visible: false, content: '', x: 0, y: 0 });
  };

  return (
    <g transform={"translate(" + xOffset + "," + height / 2 + ")"}>
      {pie(projects).map((d: any, i) => (
        <g className="arc" key={i} onMouseOver={(e) => handleMouseOver(e, d)} onMouseOut={handleMouseOut}>
          <path fill={color(i)} d={arc(d)!}></path>
          <text
            transform={`translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1]})`}
            textAnchor="middle"
            alignmentBaseline="central"
            fill="white"
          >
            {d.data.user_num}
          </text>
        </g>
      ))}
      {tooltip.visible && (
        <foreignObject x={tooltip.x - 60} y={tooltip.y - 30} width="120" height="60">
          <div className="tooltip" style={{ background: 'white', padding: '5px', borderRadius: '5px', border: '1px solid black' }}>
            {tooltip.content}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

// Plot Chart Legends
function ChartLegends({
  projects,
  color,
  height,
  xOffset,
  projectCount,
  viewType,
}: {
  projects: TDataType[];
  color: Function;
  height: number;
  xOffset: number;
  projectCount: number;
  viewType: string;
}) {
  let legendMargin = 22;
  return (
    <g
      transform={`translate(${xOffset},${
        (height - 22 * (projectCount - 1)) / 2
      })`}
    >
      {projects.map(
        (
          { project, percentage }: { project: string; percentage: string },
          i: number
        ) => (
          <g key={i}>
            <circle
              className="legend-dots"
              cx="0"
              cy={legendMargin * i - 4}
              r="7"
              fill={color(i)}
            ></circle>
            <text
              className={
				viewType === "Desktop" ? (
					project.length > 28 ? "text-sm" : "text-base"
				) : (project.length > 28 ? "text-xs" : "text-sm")
              } // scale text if project name is too long
              x="16"
              y={legendMargin * i}
              style={{ fill: "#f3f4f6" }}
            >
              {project + " (" + parseFloat(percentage).toFixed(1) + "%)"}
            </text>
          </g>
        )
      )}
    </g>
  );
}

type TPropsType = {
  className: string;
  viewType: string;
};

// Component for Active User Projects in Campus
export default function ActiveUserProjects(props: TPropsType) {
  const [projects, setProjects] = React.useState<TDataType[] | undefined>(
    undefined
  );
  const color = d3.scaleOrdinal(d3.schemeTableau10);
  const ref = React.useRef<HTMLDivElement>(null);
  const childRef = React.useRef<HTMLDivElement | null>(null);
  const [dimension, setDimension] = React.useState({
    width: 0,
    height: 0,
    radius: 0,
    pieOffset: 0,
    legendOffset: 0,
  });
  const [projectCount, setProjectCount] = React.useState(0);
  //   const dimension = useDimensions(ref);
  // const size = dimension.width - 200,
  //   radius = size / Math.PI;
  // This is TO FETCH DATA FROM API
  useEffect(() => {
    const fetchProjects = async () => {
      await axios
        .get("/on-campus/active-user-projects")
        .then((res) => {
          setProjects(cleaningData(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchProjects();
    const interval = setInterval(fetchProjects, 1000 * 60 * 1);
    return () => clearInterval(interval);
  }, []);

  // useEffect to determine number of project currently active, useful to translate chart legends
  useEffect(() => {
    if (projects && projects.length !== 0) setProjectCount(projects.length);
  }, [projects]);

  useEffect(() => {
    if (childRef.current) {
      const width = childRef.current.clientWidth;
      const height = childRef.current.clientHeight;
      const radius = Math.round(width * 0.175);
      const pieOffset = Math.round(radius * 1.1); // pie chart offset along the x-axis
      const legendOffset = Math.round(pieOffset * 2.1); // pie legend offset along the x-axis
      setDimension({
        width: width,
        height: height,
        radius: radius,
        pieOffset: pieOffset,
        legendOffset: legendOffset,
      });
    }
  }, [childRef]);

  return (
    <Card className={props.className + " flex flex-col"} ref={ref}>
      <CardTitle>Active User Projects</CardTitle>
      <div className="w-full h-full" ref={childRef}>
        {projects &&
        props.viewType !== "" &&
        dimension.width !== 0 &&
        dimension.height !== 0 &&
        dimension.radius !== 0 &&
        dimension.pieOffset !== 0 &&
        dimension.legendOffset !== 0 &&
        projectCount !== 0 ? (
          <svg
            className="pie-chart-svg"
            width={dimension.width}
            height={dimension.height}
          >
            <PieChart
              projects={projects}
              color={color}
              radius={dimension.radius}
              height={dimension.height}
              xOffset={dimension.pieOffset}
            />
            <ChartLegends
              projects={projects}
              color={color}
              height={dimension.height}
              xOffset={dimension.legendOffset}
              projectCount={projectCount}
              viewType={props.viewType}
            />
          </svg>
        ) : (
          <div className="w-full h-full bg-gray-500 rounded animate-pulse p-1" />
        )}
      </div>
    </Card>
  );
}

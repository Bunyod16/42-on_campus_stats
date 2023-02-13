import { useEffect, useRef, useState } from "react";
import { Card, H1Style } from "../styles";
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
function cleaningData(dataObj) {
  let dataset = [];
  let tots = 0;
  for (let d in dataObj) {
    dataset = [...dataset, { project: d, user_num: dataObj[d] }];
  }
  dataset = dataset.sort((a, b) => b["user_num"] - a["user_num"]).slice(0, 10);
  tots = d3.sum(dataset, (d) => d["user_num"]);
  dataset.forEach(
    (x) => (x.percentage = ((x.user_num / tots) * 100).toFixed(2) + "%")
  );
  return dataset;
}

// Function PieChart Plotting
function PieChart({ projects, color, radius }) {
  const pie = d3.pie().value((d) => d["user_num"]);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);
  return (
    <g transform={"translate(" + (radius + 40) + "," + (40 + radius) + ")"}>
      {pie(projects).map((d, i) => {
        return (
          <g className="arc">
            <path fill={color(i)} d={arc(d)}></path>
            <text
              className="chart-text"
              transform={`translate(${arc.centroid(d)[0]}, ${
                arc.centroid(d)[1]
              })`}
            >
              {d.data.percentage}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// Plot Chart Legends
function ChartLegends({ projects, color, size }) {
  return (
    <g transform={`translate(${size},${(size / 16) * 2.5})`}>
      {projects.map(({ project, user_num }, i) => (
        <>
          <circle
            className="legend-dots"
            cx="0"
            cy={i * (size / 16)}
            r="7"
            fill={color(i)}
          ></circle>
          <text
            className="text-sm"
            x="16"
            y={5 + i * (size / 16)}
            style={{ fill: "#f3f4f6" }}
          >
            {project}
          </text>
        </>
      ))}
    </g>
  );
}

// Component for Active User Projects in Campus
export default function ActiveUserProjects(props) {
  const [projects, setProjects] = useState(undefined);
  const color = d3.scaleOrdinal(d3.schemeTableau10);
  const ref = useRef();
  const dimension = useDimensions(ref);
  const size = dimension.width - 200,
    radius = size / Math.PI;
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

  return (
    <Card className={props.className} ref={ref}>
      <H1Style>Active User Projects</H1Style>
      {projects ? (
        <svg
          className="pie-chart-svg"
          width={dimension.width}
          height={(dimension.width / 16) * 9}
        >
          <PieChart projects={projects} color={color} radius={radius} />
          <ChartLegends projects={projects} color={color} size={size} />
          <p>banana</p>
        </svg>
      ) : (
        <div
          className="bg-gray-500 rounded animate-pulse"
          style={{
            width: `${dimension.width}px`,
            height: `${(dimension.width / 16) * 9}px`,
          }}
        />
      )}
    </Card>
  );
}

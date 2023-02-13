import React, { useState } from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, H1Style } from "../styles";
import "../styles/radar.css";
import axios from "axios";
import { useDimensions } from "../hooks/useDimension";
// Radar Chart :
// level : 4, width per level: 5
let skills = [
  "Adaptation & creativity",
  "Algos & AI",
  "Basics",
  "Company experience",
  "DB & Data",
  "Functional programming",
  "Graphics",
  "Group & interpersonal",
  "Imperative programming",
  "Network & system administration",
  "Object-oriented programming",
  "Organization",
  "Parallel computing",
  "Rigor",
  "Ruby",
  "Security",
  "Shell",
  "Technology integration",
  "Web",
  "Unix",
].sort((a, b) => a.length - b.length);
// Doing this swap for aesthetic purposes
let temp = skills[19];
skills[19] = skills[16];
skills[16] = temp;

// Data is a object that contains {"skills": level}
let defaultData = {};
for (let i = 0; i < skills.length; i++) defaultData[skills[i]] = 0;
/* Example dataset:
defaultData = {
  Web:0,
  Unit:0,
  Shell:0
}
*/

// Function to get a array of skills in a ordered array from biggest to smallest
function getTopSkills(dataset) {
  let arr = [];
  for (let item in dataset) arr = [...arr, [item, dataset[item]]];
  arr.sort((a, b) => {
    return b[1] - a[1];
  });
  return arr;
}
let topSkills = getTopSkills(defaultData);

// Fancy Math Blackbox to calculate angle
function angleToCoordinate(angle, value, radialScale, x, y) {
  let x_in = Math.cos(angle) * radialScale(value);
  let y_in = Math.sin(angle) * radialScale(value);
  return { x: x + x_in, y: y - y_in };
}

// Get coordinates to plot path to draw the Butterfly on the Radar
function getPathCords(data_point, radialScale, x, y) {
  let coords = [];
  for (let i = 0; i < skills.length; i++) {
    let label = skills[i];
    let angle = Math.PI / 2 + (2 * Math.PI * i) / skills.length;
    coords = [
      ...coords,
      angleToCoordinate(angle, data_point[label], radialScale, x, y),
    ];
  }
  return coords;
}

// Draw Circles on Chart
function ChartCircle({ ticks, x, y, radialScale }) {
  return (
    <>
      {ticks.map((t, i) => (
        <circle
          key={i}
          className="spider-circle"
          cx={x}
          cy={y}
          fill="none"
          stroke="#C0D0E0"
          strokeWidth="0.5"
          r={radialScale(t)}
        ></circle>
      ))}
    </>
  );
}
// Draw Lines and plot Labels
function LinesAndLabels({ radialScale, x, y }) {
  let attributes = [];
  for (let i = 0; i < skills.length; i++) {
    let objs = {};
    let label = skills[i].split(" ");
    let angle = Math.PI / 2 + (2 * Math.PI * i) / skills.length;
    let line_cord = angleToCoordinate(angle, 20, radialScale, x, y);
    let label_cord = angleToCoordinate(angle, 26, radialScale, x, y);
    if ((i >= 0 && i < 3) || i > 7)
      label_cord = angleToCoordinate(angle, 23, radialScale, x, y);
    if (i === 6 || i === 7)
      label_cord = angleToCoordinate(angle, 27, radialScale, x, y);
    if (i === 10) {
      label_cord.x -= 15;
      label_cord.y += 5;
    }
    if (i === 19) {
      label_cord.x -= 8;
      label_cord.y -= 5;
    }
    if (i === 15) label_cord.y += 5;
    if (i === 13) label_cord.y -= 5;
    if (i === 0) label_cord.y += 8;
    objs["label"] = label;
    objs["angle"] = angle;
    objs["line_cord"] = line_cord;
    objs["label_cord"] = label_cord;
    attributes.push(objs);
  }
  return (
    <>
      {attributes.map(({ label, angle, line_cord, label_cord }, i) => (
        <g key={i}>
          <line
            x1={x}
            y1={y}
            x2={line_cord.x}
            y2={line_cord.y}
            stroke="#C0D0E0"
            strokeWidth={0.5}
          ></line>
          <text
            className="text-[0.6rem]"
            fill="#f3f4f6"
            x={label_cord.x}
            y={label_cord.y}
            fontSize={5}
          >
            {label.map((x, i) => {
              if (i > 0)
                return (
                  <tspan dy={12} x={label_cord.x} key={i}>
                    {x}
                  </tspan>
                );
              else return <tspan key={i}>{x}</tspan>;
            })}
          </text>
        </g>
      ))}
    </>
  );
}

// Draw Butterfly on Radar
function DrawSkills({ skills, radialScale, x, y }) {
  let color = "#00BABC";
  let coordinates = getPathCords(skills, radialScale, x, y);
  let line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y);
  return (
    <path
      d={line(coordinates) + " Z"}
      stroke={color}
      strokeWidth={3}
      fill={color}
      opacity={0.5}
    ></path>
  );
}

export default function AverageActiveUserSkill(props) {
  const ref = useRef();
  const dimension = useDimensions(ref);
  const size = dimension.width - 100,
    x = size / 2,
    y = (((dimension.width - 50) / 16) * 9) / 2, // todo  this one need to adjust
    radius = size / 4,
    radialScale = d3.scaleLinear().domain([0, 20]).range([0, radius]),
    ticks = [5, 10, 15, 20];
  const [skills, setSkills] = useState({});
  const [topSkills, setTopSkills] = useState(getTopSkills(defaultData));
  useEffect(() => {
    const fetchSkills = async () => {
      await axios
        .get("/on-campus/active-user-skills")
        .then((res) => {
          let data = res.data;
          let finalObj = { ...defaultData };
          for (const key in data) finalObj[key] = data[key];
          setSkills(finalObj);
          setTopSkills(getTopSkills(finalObj));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchSkills();
    const interval = setInterval(fetchSkills, 1000 * 60 * 1);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className={props.className} ref={ref}>
      <H1Style>Average Active User Skills</H1Style>
      <div className="avg-user-skill">
        <svg
          className="radar-svg"
          width={dimension.width - 100}
          height={((dimension.width - 50) / 16) * 9}
        >
          <ChartCircle ticks={ticks} x={x} y={y} radialScale={radialScale} />
          <LinesAndLabels radialScale={radialScale} x={x} y={y} />
          <DrawSkills skills={skills} radialScale={radialScale} x={x} y={y} />
        </svg>
        <div className="avg-user-skill-top-3">
          <h3>Top 3</h3>
          <ul className="text-sm flex gap-4">
            <li className="w-32" key={1}>
              {topSkills[0][0]}
            </li>
            <li className="w-32" key={2}>
              {topSkills[1][0]}
            </li>
            <li className="w-32" key={3}>
              {topSkills[2][0]}
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

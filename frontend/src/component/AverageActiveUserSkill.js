import React from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, H1Style } from "../styles";
import "../styles/radar.css";
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
let dataset = {};
let temp = skills[19];
skills[19] = skills[16];
skills[16] = temp;
function randIntGen(max) {
  return Math.floor(Math.random() * max);
}

// Data is a object that contains {"skills": level}
for (let i = 0; i < skills.length; i++) dataset[skills[i]] = randIntGen(20);
/* Example dataset: 
dataset = {
  Web: 1.7,
  Unit: 2.5,
  Shell: 5
}
*/
// Function to get a 2d array of skills in a ordered array from biggest to smallest
function getTopSkills(dataset) {
  let arr = [];
  for (let item in dataset) arr = [...arr, [item, dataset[item]]];
  arr.sort((a, b) => {
    return b[1] - a[1];
  });
  return arr;
}
let topSkills = getTopSkills(dataset);

function angleToCoordinate(angle, value, radialScale) {
  let x_in = Math.cos(angle) * radialScale(value);
  let y_in = Math.sin(angle) * radialScale(value);
  return { x: 120 + x_in, y: 115 - y_in };
}

function getPathCords(data_point, radialScale) {
  let coords = [];
  for (let i = 0; i < skills.length; i++) {
    let label = skills[i];
    let angle = Math.PI / 2 + (2 * Math.PI * i) / skills.length;
    coords = [...coords, angleToCoordinate(angle, data_point[label], radialScale)];
  }
  return coords;
}

function ChartCircle({ticks, x, y, radialScale}) {
  return (
    <>
    {
      ticks.map( t => (
        <circle
        className="spider-circle"
        cx={x}
        cy={y}
        fill="none"
        stroke="#C0D0E0"
        stroke-width="0.5"
        r={radialScale(t)}
      ></circle> 
      ))
    }
    </>  
  );
}
function LinesAndLabels({radialScale}) {
  let attributes = [];
  for (let i = 0; i < skills.length; i++){
    let objs = {}
    let label= skills[i].split(" ");
    let angle = (Math.PI / 2) + ((2 * Math.PI * i) / skills.length);
    let line_cord = angleToCoordinate(angle, 20, radialScale);
    let label_cord = angleToCoordinate(angle, 26, radialScale);
    if ((i >= 0 && i < 3) || i > 7) label_cord = angleToCoordinate(angle, 23, radialScale);
    if (i === 6 || i === 7) label_cord = angleToCoordinate(angle, 27, radialScale);
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
    objs["label"] = label;
    objs["angle"] = angle;
    objs["line_cord"] = line_cord;
    objs["label_cord"] = label_cord;
    attributes.push(objs);
  }
  console.log(attributes);
  return (
    <>
    {
      attributes.map(({label, angle, line_cord, label_cord}) => (
        <>
        <line
        x1={120} y1={115}
        x2={line_cord.x} y2={line_cord.y}
        stroke="#C0D0E0" stroke-width={0.5}
        ></line>
        <text
        className="radar-label"
        x={label_cord.x} y={label_cord.y}
        fontSize={5}
        >
          {
          label.map( (x,i )=> {
            if (i > 0)
              return (<tspan dy={6} x={label_cord.x}>{x}</tspan>);
            else
              return (<tspan>{x}</tspan>);
          })
        }
        </text>
        </>
      ))
    }
    </>
  )
}

function DrawSkills({radialScale}){
  let color = "#00BABC";
  let coordinates = getPathCords(dataset, radialScale);
  let line = d3.line()
                .x((d)=>d.x)
                .y((d)=>d.y);
  return (
    <path
    d={line(coordinates) + " Z"}
    stroke={color}
    stroke-width={3}
    fill={color}
    opacity={0.5}
    >

    </path>
  )
}

export default function AverageActiveUserSkill(props) {
  const ref = useRef(null);
  const size = 330,
        x = 120, y = 115,
        radius = size / 4,
        radialScale = d3.scaleLinear().domain([0, 20]).range([0, radius]),
        ticks = [5, 10, 15, 20];
  return (
    <Card>
      <H1Style>Average Active User Skills</H1Style>
      <div className="avg-user-skill">
        <svg className="radar-svg" ref={ref}  width="270px" height="230px">
          <ChartCircle ticks={ticks} x={x} y={y} radialScale={radialScale}/>
          <LinesAndLabels radialScale={radialScale}/>
          <DrawSkills radialScale={radialScale}/>
        </svg>
        <div className="avg-user-skill-top-3">
          <h3>Top 3</h3>
          <ul>
            <li key={1}>{topSkills[0][0]}</li>
            <li key={2}>{topSkills[1][0]}</li>
            <li key={3}>{topSkills[2][0]}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

// useEffect(() => {
//   const svg = d3.select(ref.current);
  
//   ticks.forEach( t => {
//     svg.append("circle")
//        .attr("cx", x)
//        .attr("cy", y)
//        .attr("fill", "none")
//        .attr("stroke", "#C0D0E0")
//        .attr("stroke-width", "0.5")
//        .attr("r", radialScale(t))
//   });
//   // outpus a coordinate base on the angle & data value
//   // {x: int, y: int}
//   function angleToCoordinate(angle, value) {
//     let x_in = Math.cos(angle) * radialScale(value);
//     let y_in = Math.sin(angle) * radialScale(value);
//     return { x: 120 + x_in, y: 115 - y_in };
//   }
//   // loops through each skills and plot where the label should be
//   // and the lines in the spider chart
//   for (let i = 0; i < skills.length; i++) {
//     let label = skills[i].split(" ");
//     let angle = Math.PI / 2 + (2 * Math.PI * i) / skills.length;
//     let line_cord = angleToCoordinate(angle, 20);
//     let label_cord = angleToCoordinate(angle, 26);
//     if ((i >= 0 && i < 3) || i > 7) label_cord = angleToCoordinate(angle, 23);
//     if (i === 6 || i === 7) label_cord = angleToCoordinate(angle, 27);
//     if (i === 10) {
//       label_cord.x -= 15;
//       label_cord.y += 5;
//     }
//     if (i === 19) {
//       label_cord.x -= 8;
//       label_cord.y -= 5;
//     }
//     if (i === 15) label_cord.y += 5;
//     if (i === 13) label_cord.y -= 5;
//     // append the lines
//     svg
//       .append("line")
//       .attr("x1", 120)
//       .attr("y1", 115)
//       .attr("x2", line_cord.x)
//       .attr("y2", line_cord.y)
//       .attr("stroke", "#C0D0E0")
//       .attr("stroke-width", "0.5");
//     // putting the labels
//     let svg_label = svg
//       .append("text")
//       .attr("class", "radar-label")
//       .attr("x", label_cord.x)
//       .attr("y", label_cord.y)
//       .attr("font-size", 5);
//     // this loop is to put labels and check for multiple words.
//     // basically so the text go bottom of each other and not side by side
//     for (let j = 0; j < label.length; j++) {
//       if (label.length === 1) svg_label.text(label[j]);
//       else {
//         if (j > 0) {
//           svg_label
//             .append("tspan")
//             .attr("dy", 6)
//             .attr("x", label_cord.x)
//             .text(label[j]);
//         } else {
//           svg_label.append("tspan").text(label[j]);
//         }
//       }
//     }
//   }
//   // line will be given a object data with x & y
//   let line = d3
//     .line()
//     .x((d) => d.x)
//     .y((d) => d.y);
//   // returns a array of coordinates to plot later on
//   function getPathCords(data_point) {
//     let coords = [];
//     for (let i = 0; i < skills.length; i++) {
//       let label = skills[i];
//       let angle = Math.PI / 2 + (2 * Math.PI * i) / skills.length;
//       coords = [...coords, angleToCoordinate(angle, data_point[label])];
//     }
//     return coords;
//   }
//   let color = ["#00babc"];
//   let coordinates = getPathCords(dataset);
//   // plotting & drawing the charts on the web
//   svg
//     .append("path")
//     .datum(coordinates)
//     .attr("d", line)
//     .attr("stroke-width", 3)
//     .attr("stroke", color)
//     .attr("stroke-opacity", 1)
//     .attr("fill", color)
//     .attr("opacity", 0.5);
// }, []);
import { useEffect, useRef } from "react";
import { Card, H1Style } from "../styles";
import * as d3 from "d3";
import "../styles/chart.css";
const data = {
  Born2beroot: 1,
  "CPP Module 07": 1,
  "Exam Rank 02": 2,
  "Exam Rank 03": 1,
  NetPractice: 1,
  Philosophers: 1,
  ft_containers: 3,
  ft_printf: 1,
  get_next_line: 3,
  minishell: 1,
  minitalk: 2,
  push_swap: 1,
  so_long: 2,
};

// processing data
let dataset = [];
let tots = 0;
for (let d in data) {
  dataset = [...dataset, { project: d, user_num: data[d] }];
}
dataset = dataset.sort((a, b) => b["user_num"] - a["user_num"]).slice(0, 10);
tots = d3.sum(dataset, (d) => d["user_num"]);
dataset.forEach((x) => (x.percentage = x.user_num / tots));
console.log(dataset);
/*
Example :
dataset = [
  {
    project: "ft_container",
    user_num: 3
  }
]
*/
export default function ActiveUserProjects() {
  const ref = useRef(null);

  useEffect(() => {
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const svg = d3.select(ref.current),
      width = 330,
      height = 330,
      radius = Math.min(width, height) / 3,
      chart = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + ( width / 3 + 10) + "," + (10 + height / 3) + ")"
        );
    // creating pie chart thingy
    const pie = d3.pie().value((d) => {
      return d["user_num"];
    });
    // creating arcs for each item
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const arcs = chart
      .selectAll("g")
      .data(pie(dataset))
      .enter()
      .append("g")
      .attr("class", "arc");
    arcs
      .append("path")
      .attr("fill", (d, i) => {
        return color(i);
      })
      .attr("d", arc);
    arcs
      .append("text")
      .attr("transform", (d) => {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("class", "legend-text-size")
      .style("text-anchor", "middle")
      .text((d) => {
        return d3.format(".0%")(d.data.percentage);
      });
    // creating legends here
    const legend = svg.append("g").attr("transform", "translate(280,30)");
    legend
      .selectAll("legend-dots")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "legend-dots")
      .attr("cx", 0)
      .attr("cy", (d, i) => {
        return i * 20;
      })
      .attr("r", 7)
      .style("fill", (d) => {
        return color(d.project);
      });
    legend
      .selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "legend-text-size")
      .attr("x", 10)
      .attr("y", (d, i) => {
        return 5 + i * 20;
      })
      .text((d) => {
        return d.project;
      });
  }, []);

  return (
    <Card>
      <H1Style>Active User Projects</H1Style>
      <svg className="pie-chart-svg" ref={ref} width="420px" height="250px"></svg>
    </Card>
  );
}

import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";
import CardTitle from "./CardTitle";
import "../styles/ratio.css";
import { useDimensions } from "../hooks/useDimension";
import axios from "axios";
import { TranspileOutput } from "typescript";
// Ratio Bar for Cadets vs Pisciners

type TStudentType = {
  cadets: number;
  pisciners: number;
};

type TPropsType = {
  [key: string]: any;
};

function getRatio(cadets: number, pisciners: number, width: number) {
  let total = cadets + pisciners;
  let widthCadets = (cadets / total) * (width * 0.8);
  let widthPisciners = (pisciners / total) * (width * 0.8);
  return { cadets: widthCadets, pisciners: widthPisciners };
}

export default function CadetPiscineRatio(props: TPropsType) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const dimension = useDimensions(cardRef);
  const [students, setStudents] = useState<TStudentType | undefined>(undefined);
  useEffect(() => {
    const fetchRatio = async () => {
      await axios
        .get("/on-campus/cadet-pisciner-ratio")
        .then((res) => {
          let data = res.data;
          setStudents({
            cadets: parseInt(data["cadets"]),
            pisciners: parseInt(data["pisciners"]),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchRatio();
    const interval = setInterval(fetchRatio, 1000 * 60 * 1);
    return () => clearInterval(interval);
  }, []);
  let barWidth: TStudentType = { cadets: 0, pisciners: 0 };
  if (students) {
    barWidth = getRatio(students.cadets, students.pisciners, dimension.width);
  }
  return (
    <Card ref={cardRef} className="">
      <CardTitle>
        <span className="h1-cadets">Cadets</span> to{" "}
        <span className="h1-piscine">Piscine</span> ratio
      </CardTitle>
      {students ? (
        <svg
          width={dimension.width * 0.8 + 5}
          height="2rem"
          className="cadet-piscine-ratio-svg"
        >
          <g>
            <rect
              className="cadet-rect"
              width={barWidth["cadets"]}
              height="100%"
              rx="5"
            ></rect>
            {barWidth["cadets"] < barWidth["pisciners"] * 0.1 ? (
              <text
                x={barWidth["cadets"] / 2 - 21}
                y="70%"
                className="cadet-piscine-ratio-text"
              ></text>
            ) : (
              <text
                x={barWidth["cadets"] / 2 - 21}
                y="70%"
                className="cadet-piscine-ratio-text"
              >
                Cadet
              </text>
            )}
          </g>
          <g>
            <rect
              className="piscine-rect"
              width={barWidth["pisciners"]}
              x={barWidth["cadets"] + 5}
              height="100%"
              rx="5"
            ></rect>
            {barWidth["pisciners"] < barWidth["cadets"] * 0.1 ? (
              <text
                x={barWidth["cadets"] + 5 + barWidth["pisciners"] / 2 - 26}
                y="70%"
                className="cadet-piscine-ratio-text"
              ></text>
            ) : (
              <text
                x={barWidth["cadets"] + 5 + barWidth["pisciners"] / 2 - 26}
                y="70%"
                className="cadet-piscine-ratio-text"
              >
                Piscine
              </text>
            )}
          </g>
        </svg>
      ) : (
        <div className="bg-gray-500 animate-pulse w-full h-6" />
      )}
    </Card>
  );
}

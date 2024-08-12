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
  //   const cardRef = React.useRef<HTMLDivElement>(null);
  //   const dimension = useDimensions(cardRef);
  const childRef = React.useRef<HTMLDivElement | null>(null);
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });
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
    const interval = setInterval(fetchRatio, 1000 * 60 * 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (childRef.current) {
      const width = Math.round(childRef.current.clientWidth);
      const height = Math.round(childRef.current.clientHeight);
      setDimension({ width: width, height: height });
    }
  }, [childRef]);

  let barWidth: TStudentType = { cadets: 0, pisciners: 0 };
  if (students) {
    barWidth = getRatio(students.cadets, students.pisciners, dimension.width);
  }

  return (
    <Card className={props.className + " flex flex-col"}>
      <CardTitle>
        <span className="h1-cadets">Cadets </span> to{" "}
        <span className="h1-piscine">Pisciners </span> Ratio
        {` ( ${students?.cadets ? students?.cadets : 0} : ${
          students?.pisciners ? students?.pisciners : 0
        } )`}
      </CardTitle>
      <div
        className="w-full flex flex-1 items-center justify-center"
        ref={childRef}
      >
        {dimension.width !== 0 &&
          (students ? (
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
            <div className="w-full h-full animate-pulse bg-gray-500" />
          ))}
      </div>
    </Card>
  );
}

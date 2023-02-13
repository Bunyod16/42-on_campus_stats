import { useEffect, useState, useRef } from "react";
import { Card, H1Style } from "../styles";
import "../styles/ratio.css";
import { useDimensions } from "../hooks/useDimension";
import axios from "axios";
// Ratio Bar for Cadets vs Pisciners

function getRatio(cadets, pisciners, width) {
  let total = cadets + pisciners;
  let widthCadets = (cadets / total) * (width * 0.8);
  let widthPisciners = (pisciners / total) * (width * 0.8);
  return { cadets: widthCadets, pisciners: widthPisciners };
}
export default function CadetPiscineRatio(props) {
  const cardRef = useRef(null);
  const dimension = useDimensions(cardRef);
  const [students, setStudents] = useState(undefined);
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
          console.log("here");
          console.log(err);
        });
    };
    fetchRatio();
    const interval = setInterval(fetchRatio, 1000 * 60 * 1);
    return () => clearInterval(interval);
  }, []);
  let barWidth = getRatio(students.cadets, students.pisciners, dimension.width);
  return (
    <Card ref={cardRef}>
      <H1Style>
        <span className="h1-cadets">Cadets</span> to{" "}
        <span className="h1-piscine">Piscine</span> ratio
      </H1Style>
      {students ? (
        <svg
          width={dimension.width * 0.8 + 5}
          height="1.25rem"
          className="cadet-piscine-ratio-svg"
        >
          <g>
            <rect
              className="cadet-rect"
              width={barWidth["cadets"]}
              height="100%"
              rx="5"
            ></rect>
            <text
              x={barWidth["cadets"] / 2 - 21}
              y="70%"
              className="cadet-piscine-ratio-text"
            >
              Cadet
            </text>
          </g>
          <g>
            <rect
              className="piscine-rect"
              width={barWidth["pisciners"]}
              x={barWidth["cadets"] + 5}
              height="100%"
              rx="5"
            ></rect>
            <text
              x={barWidth["cadets"] + 5 + barWidth["pisciners"] / 2 - 26}
              y="70%"
              className="cadet-piscine-ratio-text"
            >
              Piscine
            </text>
          </g>
        </svg>
      ) : (
        <div className="bg-gray-500 animate-pulse w-full h-6" />
      )}
    </Card>
  );
}

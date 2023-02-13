import { useEffect, useState, useRef } from "react";
import { Card, H1Style } from "../styles";
import "../styles/ratio.css";
import { useDimensions } from "../hooks/useDimension";
import axios from "axios";
// Ratio Bar for Cadets vs Pisciners
export default function CadetPiscineRatio(props) {
  const [barWidth, setBarWidth] = useState(undefined);
  const cardRef = useRef();
  const dimension = useDimensions(cardRef);

  useEffect(() => {
    let fetchRatio = async () => {
      await axios
        .get("/on-campus/cadet-pisciner-ratio")
        .then((res) => {
          let data = res.data;
          let parseData = {
            cadets: parseInt(data["cadets"]),
            pisciners: parseInt(data["pisciners"]),
          };
          let total =
            parseInt(parseData["cadets"]) + parseInt(parseData["pisciners"]);
          let widthCadet =
            (parseData["cadets"] / total) * (dimension.width * 0.8);
          let widthPiscine =
            (parseData["pisciners"] / total) * (dimension.width * 0.8);
          setBarWidth({ cadet: widthCadet, pisciner: widthPiscine });
        })
        .catch((err) => {
          // set default width to 50/50 if api request fail
          let widthCadet = (50 / 100) * (dimension.width * 0.8);
          let widthPiscine = (50 / 100) * (dimension.width * 0.8);
          setBarWidth({ cadet: widthCadet, pisciner: widthPiscine });
          console.log(err);
        });
    };
    fetchRatio();
    const interval = setInterval(fetchRatio, 1000 * 60 * 1);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card ref={cardRef}>
      <H1Style>
        <span className="h1-cadets">Cadets</span> to{" "}
        <span className="h1-piscine">Piscine</span> ratio
      </H1Style>
      {barWidth ? (
        <svg
          width={dimension.width * 0.8 + 5}
          height="20px"
          className="cadet-piscine-ratio-svg"
        >
          <g>
            <rect
              className="cadet-rect"
              width={barWidth["cadet"]}
              height="20px"
              rx="5"
            ></rect>
            <text
              x={barWidth["cadet"] / 2 - 21}
              y="15"
              className="cadet-piscine-ratio-text"
            >
              Cadet
            </text>
          </g>
          <g>
            <rect
              className="piscine-rect"
              width={barWidth["pisciner"]}
              x={barWidth["cadet"] + 5}
              height="20px"
              rx="5"
            ></rect>
            <text
              x={barWidth["cadet"] + 5 + barWidth["pisciner"] / 2 - 26}
              y="15"
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

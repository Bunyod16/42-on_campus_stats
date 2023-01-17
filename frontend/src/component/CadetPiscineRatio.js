import { useEffect, useState } from "react";
import * as d3 from "d3";
import { Card, H1Style } from "../styles";
import "../styles/ratio.css";

function randIntGen(max) { 
    return Math.floor(Math.random() * max)
  }

// let totalCadet = randIntGen(200);
// let totalPiscine = randIntGen(100);
// console.log("Total Cadet: ", totalCadet);
// console.log("Total Piscine: ", totalPiscine);
// let total = totalCadet + totalPiscine;
// let widthCadet = (totalCadet / total) * 395;
// let widthPiscine = (totalPiscine / total) * 395;
export default function CadetPiscineRatio(props) {
  const [barWidth, setBarWidth] = useState({cadet:0,pisciner:0});
  useEffect( () =>{
    let fetchRatio = async () =>{
      fetch("/api/on-campus/cadet-pisciner-ratio")
      .then( (response) =>{
        if (response.ok)
        {
          console.log("Fetch cadet piscine ratio : Success");
          return response.json();
        }
      })
      .then ((data) => {
        let parseData = {cadets : parseInt(data["cadets"]), pisciners: parseInt(data["pisciners"])};
        let total = parseInt(parseData["cadets"]) + parseInt(parseData["pisciners"]);
        let widthCadet = (parseData["cadets"] / total) * 395;
        let widthPiscine = (parseData["pisciners"] / total) * 395;
        setBarWidth({cadet: widthCadet, pisciner: widthPiscine});
        console.log(barWidth);
      })
      .catch((error) => {
        console.error(error);
      })
    }
    fetchRatio();
    const interval = setInterval(fetchRatio, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);
  return (
    <Card>
        <H1Style><span className="h1-cadets">Cadets</span> to <span className="h1-piscine">Piscine</span> ratio</H1Style>
        <svg width="400px" height="20px" className="cadet-piscine-ratio-svg">
            <g>
                <rect className="cadet-rect" width={barWidth["cadet"]} height="20px" rx="5"></rect>
                <text x={barWidth["cadet"] / 2} y="15" className="cadet-piscine-ratio-text">Cadet</text>
            </g>
            <g>
                <rect className="piscine-rect" width={barWidth["pisciner"]} height="20px" x={barWidth["cadet"] + 5} rx="5"></rect>
                <text x={barWidth["cadet"] + (barWidth["pisciner"] / 2)} y="15" className="cadet-piscine-ratio-text">Piscine</text>
            </g>
        </svg>
    </Card>
  )
}

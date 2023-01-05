import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card, H1Style } from "../styles";
import "../styles/ratio.css";
// draw div

// div width base on percentage of piscine to cadets
// div -|

function randIntGen(max) { 
    return Math.floor(Math.random() * max)
  }

let totalCadet = randIntGen(200);
let totalPiscine = randIntGen(100);
console.log("Total Cadet: ", totalCadet);
console.log("Total Piscine: ", totalPiscine);
let total = totalCadet + totalPiscine;
let widthCadet = (totalCadet / total) * 395;
let widthPiscine = (totalPiscine / total) * 395;
export default function CadetPiscineRatio(props) {
  return (
    <Card>
        <H1Style><span className="h1-cadets">Cadets</span> to <span className="h1-piscine">Piscine</span> ratio</H1Style>
        <svg width="400px" height="20px" className="cadet-piscine-ratio-svg">
            <g>
                <rect className="cadet-rect" width={widthCadet} height="20px" rx="5"></rect>
                <text x={widthCadet / 2} y="15" className="cadet-piscine-ratio-text">Cadet</text>
            </g>
            <g>
                <rect className="piscine-rect" width={widthPiscine} height="20px" x={widthCadet + 5} rx="5"></rect>
                <text x={widthCadet + (widthPiscine / 2)} y="15" className="cadet-piscine-ratio-text">Piscine</text>
            </g>
        </svg>
    </Card>
  )
}

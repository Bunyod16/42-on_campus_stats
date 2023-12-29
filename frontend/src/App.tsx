import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import CurrentActiveUser from "./component/CurrentActiveUser";
import AverageLevel from "./component/AverageLevel";
import AverageSessionTime from "./component/AverageSessionTime";
import MostRecentSubmission from "./component/MostRecentSubmission";
import TotalActiveUser7Days from "./component/TotalActiveUser7Days";
import CadetPiscineRatio from "./component/CadetPiscineRatio";
import ActiveUserProjects from "./component/ActiveUserProjects";
import WeeklyCadetXp from "./component/WeeklyCadetXp";
import MostActiveUsers from "./component/MostActiveUsers";
import TopFarmers from "./component/TopFarmers";
import { useDimensions } from "./hooks/useDimension";
import { isMobile } from "react-device-detect";

// todo dynamic width/height based on whichever is narrower on screen

type GraphType = "TAU7D" | "WeeklyCadetXp";

function App() {
  const divRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const [graphDimension, setGraphDimension] = useState({ width: 0, height: 0 });
  const [cycleGraph, setCycleGraph] = useState<GraphType>("TAU7D");
  const cycleInterval = 20000;

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log(`Width: ${width}px, Height: ${height}px`);
      }
    });
    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
      // reload page every hour
    }, 1000 * 60 * 60 * 1);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCycleGraph((cycleGraph) =>
        cycleGraph === "TAU7D" ? "WeeklyCadetXp" : "TAU7D"
      );
    }, cycleInterval);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      const padding = 16;
      const width = Math.round(graphRef.current.clientWidth - 2 * padding);
      const height = Math.round(
        graphRef.current.clientHeight - 44 - 2 * padding
      );
      console.log("xd: width", width, "height", height);
      setGraphDimension({ width: width, height: height });
    }
  }, [graphRef]);

  return (
    <div
      className="w-screen h-fit xl:h-[100dvh] min-h-[860px] flex flex-col items-center justify-start bg-gray-800 text-center text-base overflow-y-auto"
      ref={divRef}
    >
      <div className="flex w-full flex-col items-center justify-center bg-gray-900 py-3 text-3xl text-white">
        <h1>Live Stats: 42 Kuala Lumpur</h1>
      </div>
      <div className="w-[90%] h-full min-h-[780px] flex flex-col md:grid md:grid-flow-col md:grid-cols-2 md:grid-rows-[repeat(14,minmax(0,1fr))] xl:grid-cols-5 xl:grid-rows-[repeat(12,minmax(0,1fr))] p-4 gap-3">
        <ActiveUserProjects className="xl:row-span-6 xl:col-span-2" />
        <CurrentActiveUser className="xl:row-span-6 xl:col-span-2" />
        <MostActiveUsers className="xl:row-span-3 xl:col-span-2" />
        <TopFarmers className="xl:row-span-3 xl:col-span-2" />
        <div className="xl:row-span-4 xl:col-span-2" ref={graphRef}>
          <TotalActiveUser7Days
            className={`${cycleGraph === "TAU7D" ? "block" : "hidden"}`}
            dimension={graphDimension}
          />
          <WeeklyCadetXp
            className={`${cycleGraph === "WeeklyCadetXp" ? "block" : "hidden"}`}
            dimension={graphDimension}
          />
        </div>
        <CadetPiscineRatio className="xl:row-span-2 xl:col-span-2" />
        <AverageLevel className="xl:row-span-2 xl:col-span-1" />
        <AverageSessionTime className="xl:row-span-2 xl:col-span-1" />
        <MostRecentSubmission className="xl:row-[span_8_/_span_8] xl:col-span-1" />
      </div>
    </div>
  );
}

export default App;

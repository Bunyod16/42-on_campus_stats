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

// todo dynamic width/height based on whichever is narrower on screen

type GraphType = "TAU7D" | "WeeklyCadetXp";
type ViewType = "Desktop" | "Laptop" | "Tablet" | "Mobile" | "";

function App() {
  const divRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<HTMLDivElement | null>(null);
  const [viewType, setViewType] = useState<ViewType>("");
  const [graphDimension, setGraphDimension] = useState({ width: 0, height: 0 });
  const [cycleGraph, setCycleGraph] = useState<GraphType>("TAU7D");
  const cycleInterval = 20000;

  //   useEffect(() => {
  //     const resizeObserver = new ResizeObserver((entries) => {
  //       for (const entry of entries) {
  //         const { width, height } = entry.contentRect;
  //         console.log(`Width: ${width}px, Height: ${height}px`);
  //       }
  //     });
  //     if (divRef.current) {
  //       resizeObserver.observe(divRef.current);
  //     }
  //     return () => {
  //       resizeObserver.disconnect();
  //     };
  //   }, []);

  // useEffect to determine device type based on screen width
  useEffect(() => {
    if (divRef.current) {
      const width = divRef.current.clientWidth;
      if (width >= 1900) setViewType("Desktop");
      else if (width >= 1280 && width < 1900) setViewType("Laptop");
      else if (width >= 736 && width < 1280) setViewType("Tablet");
      else setViewType("Mobile");
    }
  }, [divRef]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
      // reload page every hour
    }, 1000 * 60 * 60 * 1);
    return () => clearInterval(intervalId);
  }, []);

  // interval to cycle between TotalActiveUser7Days and WeeklyCadetXp graph
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCycleGraph((cycleGraph) =>
        cycleGraph === "TAU7D" ? "WeeklyCadetXp" : "TAU7D"
      );
    }, cycleInterval);
    return () => clearInterval(intervalId);
  }, []);

  // useEffect to determine graph size based on card width/height
  useEffect(() => {
    if (graphRef.current) {
      const padding = 16;
      const width = Math.round(graphRef.current.clientWidth - 2 * padding);
      const height = Math.round(
        graphRef.current.clientHeight - 44 - 2 * padding
      );
      setGraphDimension({ width: width, height: height });
    }
  }, [graphRef]);

  return (
    <div
      className="w-screen h-fit md:h-screen flex flex-col items-center justify-start bg-gray-800 text-center text-base overflow-y-auto"
      ref={divRef}
    >
      <div className="flex w-full flex-col items-center justify-center bg-gray-900 py-3 text-xl 2xl:text-2xl 3xl:text-3xl font-semibold text-white">
        <h1>42 Campus Live Statistics</h1>
      </div>
      <div className="w-full lg:w-[95%] 2xl:w-[90%] h-[2560px] md:h-full md:min-h-[1280px] xl:min-h-[668px] grid grid-flow-col grid-cols-1 grid-rows-[repeat(34,minmax(0,1fr))] md:grid-cols-2 md:grid-rows-[repeat(20,minmax(0,1fr))] xl:grid-cols-5 xl:grid-rows-[repeat(12,minmax(0,1fr))] p-2 md:p-4 2xl:p-6 3xl:p-10 gap-3 2xl:gap-4 3xl:gap-5">
        <ActiveUserProjects
          className="row-span-5 md:row-span-6 md:col-span-1 xl:col-span-2"
          viewType={viewType}
        />
        <CurrentActiveUser
          className="row-span-5 md:row-span-6 md:col-span-1 xl:col-span-2"
          viewType={viewType}
        />
        <MostActiveUsers className="row-span-3 md:col-span-1 md:col-start-2 xl:col-start-3 xl:col-span-2" />
        <TopFarmers className="row-span-3 md:col-span-1 md:col-start-2 xl:col-start-3 xl:col-span-2" />
        <div
          className="row-span-4 md:col-span-1 md:col-start-2 xl:col-start-3 xl:col-span-2"
          ref={graphRef}
        >
          <TotalActiveUser7Days
            className={`${cycleGraph === "TAU7D" ? "block" : "hidden"}`}
            dimension={graphDimension}
          />
          <WeeklyCadetXp
            className={`${cycleGraph === "WeeklyCadetXp" ? "block" : "hidden"}`}
            dimension={graphDimension}
          />
        </div>
        <CadetPiscineRatio className="row-span-2 md:col-span-1 md:col-start-2 xl:col-start-3 xl:col-span-2" />
        <AverageLevel className="row-span-2 md:row-span-3 md:col-span-1 md:col-start-1 md:row-start-[14] xl:col-start-5 xl:row-start-1 xl:row-span-2 xl:col-span-1" />
        <AverageSessionTime className="row-span-2 md:row-span-3 md:col-span-1 md:col-start-1 md:row-start-[17] xl:col-start-5 xl:row-start-3 xl:row-span-2 xl:col-span-1" />
        <MostRecentSubmission className="row-[span_8_/_span_8] md:col-span-1 md:col-start-2 md:row-start-[13] xl:col-start-5 xl:row-start-5 xl:col-span-1" />
      </div>
    </div>
  );
}

export default App;

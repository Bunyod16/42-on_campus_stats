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

interface ViewProps {
  cycleGraph: string;
  compWidth?: number;
}

const DesktopView = ({ cycleGraph, compWidth }: ViewProps) => {
  // const transitionTime = 20000;
  // const [currentComponent, setCurrentComponent] = useState("WeeklyCadetXp");

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentComponent((currentComponent) =>
  //       currentComponent === "WeeklyCadetXp"
  //         ? "TotalActiveUser7Days"
  //         : "WeeklyCadetXp"
  //     );
  //   }, transitionTime);
  //   return () => clearInterval(intervalId);
  // }, []);

  // const [className1, setClassName1] = useState(
  //   "transition-opacity duration-500 delay-300 opacity-100"
  // );

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setClassName1(
  //       currentComponent === "WeeklyCadetXp"
  //         ? "transition-opacity opacity-0 hidden duration-600 !p-0 !border-0 !mt-0"
  //         : "transition-opacity duration-500 delay-200 opacity-100"
  //     );
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [currentComponent]);

  // const [className2, setClassName2] = useState(
  //   "transition-opacity opacity-0 duration-600 h-0 !p-0 !border-0 !mt-0"
  // );

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setClassName2(
  //       currentComponent === "WeeklyCadetXp"
  //         ? "transition-opacity duration-500 delay-200 opacity-100"
  //         : "transition-opacity duration-600 opacity-0 hidden !p-0 !border-0 !mt-0"
  //     );
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [currentComponent]);

  return (
    <div className="w-[90%] h-full flex content-center p-4 gap-4">
      <div className="w-full flex flex-col xl:flex-row gap-4">
        <div className="w-full flex flex-[4] gap-4">
          <div className="inline-flex max-h-full flex-[2] flex-col gap-4">
            <ActiveUserProjects className="" />
            <CurrentActiveUser className="flex-[2]" />
          </div>
          <div className="inline-flex max-h-full flex-[2] flex-col gap-4">
            <MostActiveUsers />
            <TopFarmers />
            <TotalActiveUser7Days
              className={cycleGraph === "TAU7D" ? "block" : "hidden"}
            />
            <WeeklyCadetXp
              className={cycleGraph === "WeeklyCadetXp" ? "block" : "hidden"}
            />
            <CadetPiscineRatio className="h-full" />
          </div>
        </div>

        <div className="w-full flex flex-col flex-1 gap-4">
          <div className="w-full flex flex-col gap-4">
            <AverageLevel className="w-full flex-1" />
            <AverageSessionTime className="w-full flex-1" />
          </div>
          <MostRecentSubmission className="w-full" />
        </div>
      </div>
    </div>
  );
};

type ViewType = "Desktop" | "Tablet" | "Mobile" | "";
type GraphType = "TAU7D" | "WeeklyCadetXp";

function App() {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [viewType, setViewType] = useState<ViewType>("");
  const [cycleGraph, setCycleGraph] = useState<GraphType>("TAU7D");
  const cycleInterval = 20000;

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log(`Width: ${width}px, Height: ${height}px`);
        if (width >= 1280) setViewType("Desktop");
        else if (width >= 768 && width < 1280) setViewType("Tablet");
        else setViewType("Mobile");
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
        <div className="xl:row-span-4 xl:col-span-2">
          <TotalActiveUser7Days
            className={`${cycleGraph === "TAU7D" ? "block" : "hidden"}`}
          />
          <WeeklyCadetXp
            className={`${cycleGraph === "WeeklyCadetXp" ? "block" : "hidden"}`}
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

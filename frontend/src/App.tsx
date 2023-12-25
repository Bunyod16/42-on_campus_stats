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

// todo dynamic width/height based on whichever is narrower on screen

function App() {
  const transitionTime = 20000;
  const [currentComponent, setCurrentComponent] = useState("WeeklyCadetXp");
  const divRef = useRef<HTMLDivElement | null>(null);
  const dimension = useDimensions(divRef);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (divRef.current) {
      console.log(
        "height",
        divRef.current.clientHeight,
        "width",
        divRef.current.clientWidth
      );
    }
  }, [divRef]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentComponent((currentComponent) =>
        currentComponent === "WeeklyCadetXp"
          ? "TotalActiveUser7Days"
          : "WeeklyCadetXp"
      );
    }, transitionTime);
    return () => clearInterval(intervalId);
  }, []);

  const [className1, setClassName1] = useState(
    "transition-opacity duration-500 delay-300 opacity-100"
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setClassName1(
        currentComponent === "WeeklyCadetXp"
          ? "transition-opacity opacity-0 hidden duration-600 !p-0 !border-0 !mt-0"
          : "transition-opacity duration-500 delay-200 opacity-100"
      );
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentComponent]);

  const [className2, setClassName2] = useState(
    "transition-opacity opacity-0 duration-600 h-0 !p-0 !border-0 !mt-0"
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setClassName2(
        currentComponent === "WeeklyCadetXp"
          ? "transition-opacity duration-500 delay-200 opacity-100"
          : "transition-opacity duration-600 opacity-0 hidden !p-0 !border-0 !mt-0"
      );
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentComponent]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload();
      // reload page every hour
    }, 1000 * 60 * 60 * 1);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="flex w-screen h-fit min-h-[100dvh] flex-col items-center  bg-gray-800 text-center text-base overflow-auto"
      ref={divRef}
    >
      <div className="flex w-full flex-col items-center justify-center bg-gray-900 py-4 text-3xl text-white">
        <h1>Live Stats: 42 Kuala Lumpur</h1>
      </div>
      <div className="w-[95%] lg:w-[90%] xl:w-[85%] h-full flex content-center m-4 gap-4">
        <div className="w-full flex flex-col xl:flex-row gap-4">
          <div className="w-full flex flex-col md:flex-row md:flex-[4] gap-4">
            <div className="inline-flex max-h-full flex-[2] flex-col gap-4">
              <ActiveUserProjects className="" />
              <CurrentActiveUser className="flex-1" />
            </div>
            <div className="inline-flex max-h-full flex-[2] flex-col gap-4">
              <MostActiveUsers />
              <TopFarmers />
              <TotalActiveUser7Days className={className1} />
              <WeeklyCadetXp className={className2} />
              <CadetPiscineRatio className="h-full" />
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row lg:flex-1 xl:flex-col gap-4">
            <div className="w-full flex flex-col md:flex-row xl:flex-col gap-4">
              <AverageLevel className="w-full flex-1" />
              <AverageSessionTime className="w-full flex-1" />
            </div>
            <MostRecentSubmission className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

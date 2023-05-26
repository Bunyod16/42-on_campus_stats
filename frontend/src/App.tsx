import React, { useState, useEffect } from "react";
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

// TODO: dynamic width/height based on whichever is narrower on screen

function App() {
  const transitionTime = 20000;
  const [currentComponent, setCurrentComponent] = useState("WeeklyCadetXp");
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

  return (
    <div
      className={
        "text-center h-screen w-screen flex flex-col items-center bg-gray-800    text-base "
      }
    >
      {/* Top Title Bar*/}
      <div className="bg-gray-900  flex  items-center justify-center text-white py-3 w-full">
        <h1 className="text-xl md:text-2xl">Live Stats: 42 Kuala Lumpur</h1>
      </div>

      {/* Dashboard Layout */}
      <div className="flex flex-col md:flex-row w-full gap-4 xl:max-w-[80%] content-center m-4 px-4 h-full">
        <div className="flex flex-col  gap-4 h-full flex-[2]">
          <ActiveUserProjects />
          {/* <CurrentActiveUser className="flex-1" /> */}
        </div>
        <div className="flex flex-col  gap-4 h-full flex-[2]">
          {/* <MostActiveUsers /> */}
          {/* <TopFarmers /> */}
          {/* <TotalActiveUser7Days className={className1} /> */}
          {/* <WeeklyCadetXp className={className2} /> */}
          {/* <CadetPiscineRatio className="h-full" /> */}
        </div>
        <div className="flex flex-col  gap-4 h-full flex-1">
          {/* <AverageLevel /> */}
          {/* <AverageSessionTime /> */}
          {/* <MostRecentSubmission /> */}
        </div>
      </div>
    </div>
  );
}

export default App;

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
import ChangingCard from "./component/ChangingCard";

// TODO: dynamic width/height based on whichever is narrower on screen

function App() {
  return (
    <div
      className={
        "text-center min-h-screen min-w-screen flex flex-col items-center bg-gray-800 text-base overflow-x-hidden"
      }
    >
      {/* Top Title Bar*/}
      <div className="bg-gray-900  w-full flex  items-center justify-center text-white py-3 ">
        <h1 className="text-xl md:text-2xl">Live Stats: 42 Kuala Lumpur</h1>
      </div>

      {/* Dashboard Layout */}
      <div className="flex flex-col md:flex-row w-full xl:max-w-[80%] gap-4  content-center px-4 h-full">
        <div className="flex flex-col  gap-4 h-full flex-[2]">
          <ActiveUserProjects />
          <CurrentActiveUser className="flex-1" />
        </div>
        <div className="flex flex-col  gap-4 h-full flex-[2]">
          <MostActiveUsers />
          <TopFarmers />
          <ChangingCard />
          <CadetPiscineRatio className="h-full" />
        </div>
        <div className="flex flex-col gap-4 h-full flex-1">
          <AverageLevel />
          <AverageSessionTime />
          <MostRecentSubmission />
        </div>
      </div>
    </div>
  );
}
export default App;

import React, { useState, useEffect } from "react";
import './App.css';
import tw from "twin.macro";
import CurrentActiveUser from "./component/CurrentActiveUser";
import AverageLevel from "./component/AverageLevel";
import AverageSessionTime from "./component/AverageSessionTime";
import MostRecentSubmission from "./component/MostRecentSubmission";
import TotalActiveUser7Days from "./component/TotalActiveUser7Days";
import ActiveUserProjects from "./component/ActiveUserProjects";
import AverageActiveUserSkill from "./component/AverageActiveUserSkill";
import CadetPiscineRatio from "./component/CadetPiscineRatio";
import WeeklyCadetXp from "./component/WeeklyCadetXp";

const StyledApp = tw.div`
  text-center h-screen flex flex-col items-center bg-gray-800  min-w-[1200px] min-h-[1200px] text-base
`;

const Header = tw.header`
  bg-gray-900
  text-3xl
  flex flex-col items-center justify-center text-white
  py-4
  w-full
`;

const FlexContainer = tw.div`
  flex w-full gap-4 xl:max-w-[80%] content-center m-4 px-4 h-full
`;

const FlexList = tw.div`
  flex-col inline-flex gap-4 max-h-full
`;

function App() {
  const [currentComponent, setCurrentComponent] = useState("WeeklyCadetXp");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentComponent(currentComponent =>
        currentComponent === "WeeklyCadetXp" ? "TotalActiveUser7Days" : "WeeklyCadetXp"
      );
    }, 20000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    
    <StyledApp>
      <Header>
        <h1>Live Stat: 42 Kuala Lumpur</h1>
      </Header>
      <FlexContainer>
        <FlexList className="flex-[2]">
          <ActiveUserProjects className="" />
          <CurrentActiveUser className="flex-1" />
        </FlexList>
        <FlexList className="flex-[2]">
          <AverageActiveUserSkill className="" />
          {currentComponent === "WeeklyCadetXp" ? (
            <WeeklyCadetXp className="component-wrapper fade-in-out"/>
          ) : (
            <TotalActiveUser7Days className="component-wrapper fade-in-out" />
          )}
          <CadetPiscineRatio className="h-full" />
        </FlexList>
        <FlexList className="flex-1">
          <AverageLevel className="" />
          <AverageSessionTime className="" />
          <MostRecentSubmission className="flex-1" />
        </FlexList>
      </FlexContainer>
    </StyledApp>
  );
}

export default App;

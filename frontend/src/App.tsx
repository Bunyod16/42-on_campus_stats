import React from "react";
import logo from "./logo.svg";
// import './App.css';
import tw from "twin.macro";
import CurrentActiveUser from "./component/CurrentActiveUser";
import AverageLevel from "./component/AverageLevel";
import AverageSessionTime from "./component/AverageSessionTime";
import MostRecentSubmission from "./component/MostRecentSubmission";
import TotalActiveUser7Days from "./component/TotalActiveUser7Days";

const StyledApp = tw.div`
  text-center h-screen flex flex-col items-center bg-gray-800 min-h-[896px] min-w-[1200px]
`;

const Header = tw.header`
  bg-gray-900
  text-3xl
  flex flex-col items-center justify-center text-white
  py-4
  w-full
`;

const AppLogo = tw.img`
  h-80
  animate-spin
`;

const FlexContainer = tw.div`
  flex w-full h-full gap-4 p-8 max-w-7xl content-center
`;

const FlexList = tw.div`
  flex-col flex gap-4
`;

const FlexItem = tw.div`
  text-center align-middle bg-gray-700 rounded-xl
`;

function App() {
  return (
    <StyledApp>
      <Header>
        <h1>Live Stat: 42 Kuala Lumpur</h1>
      </Header>
      <FlexContainer>
        <FlexList className="flex-[2_2_0%]">
          <FlexItem className="flex-[3_3_0%]">1</FlexItem>
          <FlexItem className="flex-[3_3_0%]">1</FlexItem>
          <FlexItem className="flex-[2_2_0%]">1</FlexItem>
        </FlexList>
        <FlexList className="flex-[2_2_0%]">
          <CurrentActiveUser className="flex-[3_3_0%]" />
          <TotalActiveUser7Days className="flex-[2_2_0%]" />
        </FlexList>
        <FlexList className="flex-1">
          <AverageLevel className="flex-1" />
          <AverageSessionTime className="flex-1" />
          <MostRecentSubmission className="flex-1" />
        </FlexList>
      </FlexContainer>
    </StyledApp>
  );
}

export default App;

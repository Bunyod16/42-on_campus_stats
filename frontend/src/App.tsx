import React from "react";
import logo from "./logo.svg";
// import './App.css';
import tw from "twin.macro";
import CurrentActiveUser from "./component/CurrentActiveUser";

const StyledApp = tw.div`
  text-center h-screen flex flex-col items-center
`;

const Header = tw.header`
  bg-[#282c34]
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
  text-center align-middle bg-teal-700 rounded-xl
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
          <FlexItem className="flex-[2_2_0%]">2</FlexItem>
        </FlexList>
        <FlexList className="flex-1">
          <FlexItem className="flex-1">3</FlexItem>
          <FlexItem className="flex-1">3</FlexItem>
          <FlexItem className="flex-1">3</FlexItem>
        </FlexList>
      </FlexContainer>
    </StyledApp>
  );
}

export default App;

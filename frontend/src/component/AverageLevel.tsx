import { Card, H1Style } from "../styles";
import tw from "twin.macro";
import React from "react";
import axios from "axios";
interface IAverageLevelProps {
  className?: string;
}

const NumberDisplay = tw.div`
    text-6xl h-full align-middle flex justify-center items-center
`;

const AverageLevel = ({ className }: IAverageLevelProps) => {
  const [averageLvl, setAverageLvl] = React.useState(undefined);

  React.useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/on-campus/average-user-level")
        .then((res) => {
          let data = res.data;
          setAverageLvl(data["average_level"]);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();

    // Call the API every 5 minutes
    const interval = setInterval(fetchData, 1000 * 60 * 1);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Average level</H1Style>
      {averageLvl ? (
        <NumberDisplay>{averageLvl}</NumberDisplay>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-16" />
      )}
    </Card>
  );
};

export default AverageLevel;

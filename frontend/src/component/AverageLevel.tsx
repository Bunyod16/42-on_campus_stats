import { Card, H1Style } from "../styles";
import tw from "twin.macro";
import React from "react";

interface IAverageLevelProps {
  className?: string;
}

const NumberDisplay = tw.div`
    text-6xl h-full align-middle flex justify-center items-center
`;

const AverageLevel = ({ className }: IAverageLevelProps) => {
  const [averageLvl, setAverageLvl] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/on-campus/average-user-level")
        .then((response) => {
          if (response.ok) {
            console.log("Successfully fetch Average User Level");
            return response.json();
          }
        })
        .then((data) => setAverageLvl(data.average_level))
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();

    // Call the API every 5 minutes
    const interval = setInterval(fetchData, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Average level</H1Style>
      <NumberDisplay>{averageLvl}</NumberDisplay>
    </Card>
  );
};

export default AverageLevel;

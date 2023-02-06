import { Card, H1Style } from "../styles";
import tw from "twin.macro";
import React from "react";

interface IAverageSessionTimeProps {
  className?: string;
}

const NumberDisplay = tw.div`
    text-6xl h-full align-middle flex flex-col justify-center items-center
`;

const SubText = tw.p`
    text-lg
`;

const AverageSessionTime = ({ className }: IAverageSessionTimeProps) => {
  const [averageSessionTime, setAverageSessionTime] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      await fetch("https://backend-flask.onrender.com/api/on-campus/average-session-hours")
        .then((response) => {
          if (response.ok) {
            console.log("Successfully fetch Average Session Hours");
            return response.json();
          }
        })
        .then((data) => setAverageSessionTime(data.average_session_hours))
        .catch((error) => {
          console.error(error);
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
      <H1Style>Average session time</H1Style>
      <NumberDisplay>
        {averageSessionTime}hr
      </NumberDisplay>
    </Card>
  );
};

export default AverageSessionTime;

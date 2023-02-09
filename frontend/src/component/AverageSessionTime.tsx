import { Card, H1Style } from "../styles";
import tw from "twin.macro";
import React from "react";
import axios from "axios";
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
      await axios.get("/on-campus/average-session-hours")
                 .then( res => {
                  setAverageSessionTime(res.data["average_session_hours"])
                 })
                 .catch( err => {
                  console.log(err);
                 })
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

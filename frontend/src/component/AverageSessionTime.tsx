import React from "react";
import axios from "axios";
import Card from "./Card";
import CardTitle from "./CardTitle";

interface IAverageSessionTimeProps {
  className?: string;
}

const AverageSessionTime = ({ className }: IAverageSessionTimeProps) => {
  const [averageSessionTime, setAverageSessionTime] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/on-campus/average-session-hours")
        .then((res) => {
          setAverageSessionTime(res.data["average_session_hours"]);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();

    // Call the API every 5 minutes
    const interval = setInterval(fetchData, 1000 * 60 * 10);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={className + " flex flex-col"}>
      <CardTitle>Average session time</CardTitle>
      {averageSessionTime ? (
        <div className="text-5xl xl:text-4xl 2xl:text-6xl h-full align-middle flex flex-col justify-center items-center">
          {averageSessionTime}hr
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default AverageSessionTime;

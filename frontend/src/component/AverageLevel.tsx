import React from "react";
import axios from "axios";
import Card from "./Card";
import CardTitle from "./CardTitle";

const AverageLevel = ({ className }: { className: string }) => {
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
      <CardTitle>Average level</CardTitle>
      {averageLvl ? (
        <div className="text-6xl h-full align-middle flex justify-center items-center">
          {averageLvl}
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-16" />
      )}
    </Card>
  );
};

export default AverageLevel;

import React from "react";
import axios from "axios";
import Card from "./Card";
import CardTitle from "./CardTitle";
import UserContainer from "./UserContainer";
import { UPDATE_TIME } from "../constant/global";

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  xp: number;
}

function formatNumber(num: number) {
  if (num >= 1000 && num < 1000000) {
    const numString = (num / 1000).toFixed(1);
    if (numString.endsWith(".0")) {
      return numString.slice(0, -2) + "k";
    } else {
      return numString + "k";
    }
  } else {
    return num.toString();
  }
}
function ColumnComponent({ imageSrc, login, xp }: ColumnComponentProps) {
  return (
    <UserContainer imgSrc={imageSrc} login={login} extra={formatNumber(xp)} />
  );
}

interface ITopFarmers {
  className?: string;
}
const TopFarmers = ({ className }: ITopFarmers) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("/weekly-most-gained-xp")
        .then((res) => {
          const data = res.data;
          if (JSON.stringify(data) !== "{}") {
            setData(data);
            console.log("TopFarmers get successful");
          } else {
            setData([
              { login: "notworking", xp: 0, image: "" },
              { login: "notworking", xp: 0, image: "" },
              { login: "notworking", xp: 0, image: "" },
              { login: "notworking", xp: 0, image: "" },
              { login: "notworking", xp: 0, image: "" },
            ]);
            console.log("TopFarmers get successful but data empty.");
          }
        })
        .catch((err) => {
          setData([
            { login: "notworking", xp: 0, image: "" },
            { login: "notworking", xp: 0, image: "" },
            { login: "notworking", xp: 0, image: "" },
            { login: "notworking", xp: 0, image: "" },
            { login: "notworking", xp: 0, image: "" },
          ]);
          console.log(err);
        });
    };
    fetchUsers();

    // Call the API every 5 minutes
    const interval = setInterval(fetchUsers, UPDATE_TIME);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  // console.log(data.length);
  // o
  return (
    // the container for the svg
    // TODO take away the column components
    <Card className={className + " flex flex-col"} ref={containerRef}>
      <CardTitle>Top Xp Farmers (7 days)</CardTitle>
      {data ? (
        <div className="grid grid-cols-5 gap-2 h-full  w-full">
          {data.map((d: any, id) => (
            <UserContainer
              key={id}
              imgSrc={d.image}
              login={d.login}
              extra={formatNumber(d.xp)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-[84px] 2xl:h-[108px]" />
      )}
    </Card>
  );
};

export default TopFarmers;

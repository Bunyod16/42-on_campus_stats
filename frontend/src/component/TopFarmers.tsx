import React from "react";
import axios from "axios";
import Card from "./Card";
import CardTitle from "./CardTitle";
import UserContainer from "./UserContainer";

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  xp: number;
}

function formatNumber(num: number) {
  if (num >= 1000 && num < 1000000) {
    let numString = (num / 1000).toFixed(1);
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
  const [data, setData] = React.useState<any | undefined>(undefined);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("/weekly-most-gained-xp")
        .then((res) => {
          let data = res.data;
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
    const interval = setInterval(fetchUsers, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  // console.log(data.length);
  return (
    // the container for the svg
    // TODO take away the column components
    <Card className={className + " flex flex-col"} ref={containerRef}>
      <CardTitle>Top Xp Farmers (7 days)</CardTitle>
      {data ? (
        <div className="grid grid-cols-5 gap-6 h-full basis-0 grow shrink w-full">
          <ColumnComponent
            imageSrc={data[0].image}
            login={data[0].login}
            xp={data[0].xp}
          />
          <ColumnComponent
            imageSrc={data[1].image}
            login={data[1].login}
            xp={data[1].xp}
          />
          <ColumnComponent
            imageSrc={data[2].image}
            login={data[2].login}
            xp={data[2].xp}
          />
          <ColumnComponent
            imageSrc={data[3].image}
            login={data[3].login}
            xp={data[3].xp}
          />
          <ColumnComponent
            imageSrc={data[4].image}
            login={data[4].login}
            xp={data[4].xp}
          />
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default TopFarmers;

import React from "react";
import axios from "axios";
import CardTitle from "./CardTitle";
import Card from "./Card";
import UserContainer from "./UserContainer";
import { UPDATE_TIME } from "../constant/global";

interface IMostActiveUsers {
  className?: string;
}
const MostActiveUsers = ({ className }: IMostActiveUsers) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("/weekly-most-active-users")
        .then((res) => {
          const data = res.data;
          if (JSON.stringify(data) !== "{}") {
            setData(data);
            console.log("MostRecentSubmission get successful");
          } else {
            // setData([
            //   { login: "notworking", hours: 0, image: "" },
            //   { login: "notworking", hours: 0, image: "" },
            //   { login: "notworking", hours: 0, image: "" },
            //   { login: "notworking", hours: 0, image: "" },
            //   { login: "notworking", hours: 0, image: "" },
            // ]);
            setData([
              ...Array(10).map((i) => ({
                login: "notworking",
                hours: 0,
                image: "",
              })),
            ]);
            console.log("MostRecentSubmission get successful but data empty.");
          }
        })
        .catch((err) => {
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
  return (
    // TODO: remove the column components (redundant)
    <Card className={className + " flex flex-col"} ref={containerRef}>
      <CardTitle>Top Sleepless Zombies (7 days)</CardTitle>
      {data ? (
        <div className="grid grid-cols-5 gap-2 h-full  w-full">
          {data.map((d: any, id) => (
            <UserContainer
              key={id}
              imgSrc={d.image}
              login={d.login}
              extra={d.hours + "h"}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-[84px] 2xl:h-[108px]" />
      )}
    </Card>
  );
};

export default MostActiveUsers;

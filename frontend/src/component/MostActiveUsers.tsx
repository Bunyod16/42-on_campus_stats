import React from "react";
import axios from "axios";
import CardTitle from "./CardTitle";
import Card from "./Card";
import UserContainer from "./UserContainer";
interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  hours: string;
}

//grid grid-cols-5 gap-4 overflow-hidden scroll-smooth h-full basis-0 grow shrink w-full
function ColumnComponent({ imageSrc, login, hours }: ColumnComponentProps) {
  return <UserContainer imgSrc={imageSrc} login={login} extra={hours + "h"} />;
}

interface IMostActiveUsers {
  className?: string;
}
const MostActiveUsers = ({ className }: IMostActiveUsers) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState<any | undefined>(undefined);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("/weekly-most-active-users")
        .then((res) => {
          let data = res.data;
          if (JSON.stringify(data) !== "{}") {
            setData(data);
            console.log("MostRecentSubmission get successful");
          } else {
            setData([
              { login: "notworking", hours: 0, image: "" },
              { login: "notworking", hours: 0, image: "" },
              { login: "notworking", hours: 0, image: "" },
              { login: "notworking", hours: 0, image: "" },
              { login: "notworking", hours: 0, image: "" },
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
    const interval = setInterval(fetchUsers, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  // console.log(data.length);
  return (
    // TODO remove the column components (redundant)
    <Card className={className + " flex flex-col"} ref={containerRef}>
      <CardTitle>Top Sleepless Zombies (7 days)</CardTitle>
      {data ? (
        <div className="grid grid-cols-5 gap-6 h-full basis-0 grow shrink w-full">
          <ColumnComponent
            imageSrc={data[0].image}
            login={data[0].login}
            hours={data[0].hours}
          />
          <ColumnComponent
            imageSrc={data[1].image}
            login={data[1].login}
            hours={data[1].hours}
          />
          <ColumnComponent
            imageSrc={data[2].image}
            login={data[2].login}
            hours={data[2].hours}
          />
          <ColumnComponent
            imageSrc={data[3].image}
            login={data[3].login}
            hours={data[3].hours}
          />
          <ColumnComponent
            imageSrc={data[4].image}
            login={data[4].login}
            hours={data[4].hours}
          />
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default MostActiveUsers;

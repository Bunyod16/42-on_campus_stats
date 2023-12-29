import React from "react";
import axios from "axios";
import CardTitle from "./CardTitle";
import Card from "./Card";
import UserContainer from "./UserContainer";
interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  hours: string;
  imgSize: number;
}

//grid grid-cols-5 gap-4 overflow-hidden scroll-smooth h-full basis-0 grow shrink w-full
function ColumnComponent({
  imageSrc,
  login,
  hours,
  imgSize,
}: ColumnComponentProps) {
  return <UserContainer imgSrc={imageSrc} login={login} extra={hours + "h"} />;
}

interface IMostActiveUsers {
  className?: string;
}
const MostActiveUsers = ({ className }: IMostActiveUsers) => {
  const childRef = React.useRef<HTMLDivElement>(null);
  const [data, setData] = React.useState<any | undefined>(undefined);
  const [imageSize, setImageSize] = React.useState(0);

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

  React.useEffect(() => {
    if (childRef.current) {
      const height = childRef.current.clientHeight;
      setImageSize(height * 0.6);
    }
  }, [childRef]);

  return (
    // TODO remove the column components (redundant)
    <Card className={className + " flex flex-col"}>
      <CardTitle>Top Sleepless Zombies (7 days)</CardTitle>
      {data ? (
        <div
          className="grid grid-cols-5 gap-6 h-full basis-0 grow shrink w-full"
          ref={childRef}
        >
          {data.map((item: any, index: number) => (
            <ColumnComponent
              key={index}
              imageSrc={item.image}
              login={item.login}
              hours={item.hours}
              imgSize={imageSize}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default MostActiveUsers;

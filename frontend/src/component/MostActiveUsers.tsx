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
  return (
    <UserContainer
      imgSrc={imageSrc}
      login={login}
      extra={hours + "h"}
      imgSize={imgSize}
    />
  );
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

  // useEffect to determine user img size based on card width/height
  React.useEffect(() => {
    if (childRef.current) {
      const width = childRef.current.clientWidth,
        height = childRef.current.clientHeight;
      const imgSizeOnWidth = Math.round((width / 5) * 0.7),
        imgSizeOnHeight = Math.round(height * 0.5);
      if (imgSizeOnWidth > imgSizeOnHeight) setImageSize(imgSizeOnHeight);
      else setImageSize(imgSizeOnWidth);
    }
  }, [childRef]);

  return (
    // TODO remove the column components (redundant)
    <Card className={className + " flex flex-col"}>
      <CardTitle>Top Sleepless Zombies (7 days)</CardTitle>
      <div className="w-full h-full" ref={childRef}>
        {imageSize !== 0 &&
          (data ? (
            <div className="grid grid-cols-5 gap-6 h-full basis-0 grow shrink w-full items-center justify-center">
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
          ))}
      </div>
    </Card>
  );
};

export default MostActiveUsers;

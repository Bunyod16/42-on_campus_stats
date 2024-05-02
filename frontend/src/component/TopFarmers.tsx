import React from "react";
import axios from "axios";
import Card from "./Card";
import CardTitle from "./CardTitle";
import UserContainer from "./UserContainer";

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  xp: number;
  imgSize: number;
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
function ColumnComponent({
  imageSrc,
  login,
  xp,
  imgSize,
  profileUrl,
}: ColumnComponentProps & { profileUrl: string }) {
  return (
    <a href={profileUrl} target="_blank" rel="nooper noreferrer">
      <UserContainer
        imgSrc={imageSrc}
        login={login}
        extra={formatNumber(xp)}
        imgSize={imgSize}
      />
    </a>
  );
}

interface ITopFarmers {
  className?: string;
}
const TopFarmers = ({ className }: ITopFarmers) => {
  const [data, setData] = React.useState<any | undefined>(undefined);
  const childRef = React.useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = React.useState(0);

  React.useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("/on-campus/weekly-most-gained-xp")
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
    // the container for the svg
    // TODO take away the column components
    <Card className={className + " flex flex-col"}>
      <CardTitle>Top Xp Farmers (7 days)</CardTitle>
      <div className="w-full h-full" ref={childRef}>
        {imageSize !== 0 &&
          (data ? (
            <div className="grid grid-cols-5 h-full basis-0 grow shrink w-full items-center justify-around">
              {data.map((item: any, index: number) => (
                <ColumnComponent
                  key={index}
                  imageSrc={item.image}
                  login={item.login}
                  xp={item.xp}
                  imgSize={imageSize}
                  profileUrl={`https://intra.42.fr/users/${item.login}`}
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

export default TopFarmers;

import React from "react";
import { Card, H1Style } from "../styles";
import axios from "axios";
import tw from "twin.macro";

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  xp: number;
}

const UserContainer = tw.div`
  flex flex-col items-center 
  [> img]:(rounded-full h-16 w-16 object-cover)
  [> p]:(text-sm text-[#FFFFF] font-medium)
  [> b]:(text-lg text-[#FFFFF] font-medium)
`;

const Container = tw.div`
grid grid-cols-5 gap-6 h-full basis-0 grow shrink w-full
`;
function formatNumber(num: number) {
  if (num >= 1000 && num < 1000000) {
    let numString = (num / 1000).toFixed(1);
    if (numString.endsWith('.0')) {
      return numString.slice(0, -2);
    } else {
      return numString;
    }
  } else {
    return num.toString();
  }
}

function ColumnComponent({imageSrc, login, xp}: ColumnComponentProps) {
  return (
    <UserContainer>
      <img src={imageSrc}/>
        <p>{login}</p>
        <p><span className="font-bold text-xl">{formatNumber(xp)}</span>k</p>
    </UserContainer>
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
          if (JSON.stringify(data) !== "{}") 
          {
            setData(data);
            console.log("TopFarmers get successful");
          }
          else
          {
            setData([{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""}])
            console.log("TopFarmers get successful but data empty.");
          }
            
        })
        .catch((err) => {
          setData([{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""},{login:'notworking',xp:0, image:""}])
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
    <Card className={className + " flex flex-col"} ref={containerRef}>
      <H1Style>
        Top Xp Farmers (7 days)
      </H1Style>
      {data ? (
        <Container>
          <ColumnComponent imageSrc={data[0].image} login={data[0].login} xp={data[0].xp} />
          <ColumnComponent imageSrc={data[1].image} login={data[1].login} xp={data[1].xp} />
          <ColumnComponent imageSrc={data[2].image} login={data[2].login} xp={data[2].xp} />
          <ColumnComponent imageSrc={data[3].image} login={data[3].login} xp={data[3].xp} />
          <ColumnComponent imageSrc={data[4].image} login={data[4].login} xp={data[4].xp} />
        </Container>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default TopFarmers;

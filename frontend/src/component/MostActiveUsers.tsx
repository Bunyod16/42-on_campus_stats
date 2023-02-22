import {
  axisBottom,
  axisLeft,
  ScaleBand,
  scaleBand,
  scaleLinear,
  ScaleLinear,
  select,
} from "d3";
import React from "react";
import { useDimensions } from "../hooks/useDimension";
import { Card, H1Style } from "../styles";
import axios from "axios";
import tw from "twin.macro";

interface Data {
  label: string;
  value: number;
}

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  hours: string;
}

const Container = tw.div`
  flex flex-col items-center
  [> img]:(rounded-full h-10 w-10 object-cover)
  [> p]:(text-lg text-[#FFFFF] font-medium)
`;

function ColumnComponent({imageSrc, login, hours}: ColumnComponentProps) {
  return (
    <Container>
      <img src={imageSrc}/>
        <p>{login}</p>
        <p>{hours}h</p>
    </Container>
  );
}



interface IMostActiveUsers {
  className?: string;
}
const MostActiveUsers = ({ className }: IMostActiveUsers) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  // const [data, setData] = React.useState<any | undefined>(undefined);

  const dimension = useDimensions(containerRef);

  // React.useEffect(() => {
  //   const fetchUsers = async () => {
  //     await axios
  //       .get("/on-campus/daily-total-active-students")
  //       .then((res) => {
  //         let data = res.data;
  //         const newData = Object.keys(data).map((key) => {
  //           const date = new Date(key).toDateString().split(" ");
  //           return {
  //             label: date[1] + " " + date[2],
  //             value: data[key as keyof typeof data],
  //           };
  //         });
  //         setData(newData);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
    // fetchUsers();

    // Call the API every 5 minutes
    // const interval = setInterval(fetchUsers, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    // return () => clearInterval(interval);
  // }, []);
  let data = [{image: 'https://cdn.intra.42.fr/users/7707a27ecefed41b4c2b7a7d9e53c583/bshamsid.jpg', login: 'somebro', hours: '100'},{image: 'https://cdn.intra.42.fr/users/7707a27ecefed41b4c2b7a7d9e53c583/bshamsid.jpg', login: 'somebro', hours: '42'},{image: 'https://cdn.intra.42.fr/users/7707a27ecefed41b4c2b7a7d9e53c583/bshamsid.jpg', login: 'somebro', hours: '25'}];
  console.log(data.length);
  return (
    // the container for the svg
    <Card className={className + " flex flex-col"} ref={containerRef}>
      <H1Style>
        Top Sleepless Zombies (7 days)
      </H1Style>
      {data ? (
        <Container>
          <ColumnComponent imageSrc="https://cdn.intra.42.fr/users/7707a27ecefed41b4c2b7a7d9e53c583/bshamsid.jpg" login="bshamsid" hours="140"/>
        </Container>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default MostActiveUsers;

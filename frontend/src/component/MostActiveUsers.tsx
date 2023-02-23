import React from "react";
import { Card, H1Style } from "../styles";
import axios from "axios";
import tw from "twin.macro";

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  hours: string;
}

const UserContainer = tw.div`
  flex flex-col items-center 
  [> img]:(rounded-full h-20 w-20 object-cover)
  [> p]:(text-sm text-[#FFFFF] font-medium)
  [> b]:(text-xl text-[#FFFFF] font-medium)
`;

const Container = tw.div`
grid grid-cols-5 gap-6 h-full basis-0 grow shrink w-full
`;
//grid grid-cols-5 gap-4 overflow-hidden scroll-smooth h-full basis-0 grow shrink w-full
function ColumnComponent({imageSrc, login, hours}: ColumnComponentProps) {
  return (
    <UserContainer>
      <img src={imageSrc}/>
        <p>{login}</p>
        <b>{hours}h</b>
    </UserContainer>
  );
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
          if (JSON.stringify(data) !== "{}") 
          {
            setData(data);
            console.log("MostRecentSubmission get successful");
          }
          else
          {
            setData([{login:'notworking',hours:0, image:""},{login:'notworking',hours:0, image:""},{login:'notworking',hours:0, image:""},{login:'notworking',hours:0, image:""},{login:'notworking',hours:0, image:""}])
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
    // the container for the svg
    <Card className={className + " flex flex-col"} ref={containerRef}>
      <H1Style>
        Top Sleepless Zombies (7 days)
      </H1Style>
      {data ? (
        <Container>
          <ColumnComponent imageSrc={data[0].image} login={data[0].login} hours={data[0].hours} />
          <ColumnComponent imageSrc={data[1].image} login={data[1].login} hours={data[1].hours} />
          <ColumnComponent imageSrc={data[2].image} login={data[2].login} hours={data[2].hours} />
          <ColumnComponent imageSrc={data[3].image} login={data[3].login} hours={data[3].hours} />
          <ColumnComponent imageSrc={data[4].image} login={data[4].login} hours={data[4].hours} />
        </Container>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default MostActiveUsers;

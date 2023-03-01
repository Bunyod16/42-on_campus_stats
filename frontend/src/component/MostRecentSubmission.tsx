import { Card, H1Style } from "../styles";
import tw from "twin.macro";
import React from "react";
import axios from "axios";

interface IMostRecentSubmissionProps {
  className?: string;
}

const Container = tw.div`
    text-6xl align-middle flex flex-col justify-center items-center gap-5
`;

const Project = tw.div`
  flex flex-col items-center 
`;

const Row = tw.div`
  flex flex-row items-center m-auto space-x-1
  [> p]:(text-xs text-[#FFFFF])
`;

interface User {
  image: string;
  login: string;
}

interface ProjectContainerProps {
  name: string;
  time_string: string;
  score: number;
  users: User[];
}

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
}

const UserContainer = tw.div`
  flex flex-col items-center 
  [> img]:(rounded-full h-16 w-16 object-cover)
  [> p]:(text-sm text-[#FFFFF] font-medium)
  [> b]:(text-lg text-[#FFFFF] font-medium)
`;

function ColumnComponent({imageSrc, login}: ColumnComponentProps) {
  return (
    <UserContainer>
      <img src={imageSrc}/>
        <p>{login}</p>
    </UserContainer>
  );
}

function ProjectContainer({name, time_string, score, users}: ProjectContainerProps) {
  return (
    <Project>
      <Row>
      {users.map((user) => (
        <ColumnComponent imageSrc={user.image} login={user.login}/>
      ))}
      </Row>
          <p className="text-lg">{name}</p>
          <p className="text-sm">score: <span className="text-xl text-green-500 font-bold">{score}</span>/100</p>
          <p className="text-sm text-gray-400">{time_string}</p>
    </Project>
  );
}

interface RecentSubmission {
  project: string;
  score: number;
  time: string;
  users: User[];
}

const MostRecentSubmission = ({ className }: IMostRecentSubmissionProps) => {
  const [data, setData] = React.useState<RecentSubmission[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/most-recent-submission")
        .then((res) => {
          let data = res.data;
          if (JSON.stringify(data) !== "{}") setData(data);
          else
            console.log("MostRecentSubmission get successful but data empty.");
        })
        .catch((err) => {
          console.log(err);
          setData(undefined);
        });
    };
    fetchData();

    // Call the API every 5 minutes
    const interval = setInterval(fetchData, 1000 * 60 * 1);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  // let data = [{users: [{login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'},{login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'},{login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}], project: 'testproj', score: 125, time: 'now'}, {users: [{login: 'ksshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}], project: 'testproj', score: 25, time: 'later'}, ]
  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Recent Submissions</H1Style>
      {data ? (
        <Container>
          <ProjectContainer name={data[0].project} time_string={data[0].time} score={data[0].score} users={data[0].users} />
          <ProjectContainer name={data[1].project} time_string={data[1].time} score={data[1].score} users={data[1].users} />
          <ProjectContainer name={data[2].project} time_string={data[2].time} score={data[2].score} users={data[2].users} />
        </Container>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default MostRecentSubmission;

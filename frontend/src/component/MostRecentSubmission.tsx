import React from "react";
import axios from "axios";
import Card from "./Card";
import CardTitle from "./CardTitle";
import UserContainer from "./UserContainer";
import { UPDATE_TIME } from "../constant/global";

interface IMostRecentSubmissionProps {
  className?: string;
}

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

function ColumnComponent({ imageSrc, login }: ColumnComponentProps) {
  return <UserContainer imgSrc={imageSrc} login={login} />;
}

function ProjectContainer({
  name,
  time_string,
  score,
  users,
}: ProjectContainerProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center gap-1">
        {users.map((user, i) => (
          <ColumnComponent key={i} imageSrc={user.image} login={user.login} />
        ))}
      </div>
      <p className="text-lg">{name}</p>
      <p className="">
        <span className="text-xl text-green-500">{score}</span>/100
      </p>
      <span className="text-sm text-gray-400">{time_string}</span>
    </div>
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
          const data = res.data;
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
    const interval = setInterval(fetchData, UPDATE_TIME);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  // let data = [{users: [{login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'},{login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'},{login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}], project: 'testproj', score: 125, time: 'now'}, {users: [{login: 'ksshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}], project: 'testproj', score: 25, time: 'later'}, ]
  return (
    <Card className={className + " flex flex-col flex-1 overflow-hidden"}>
      <CardTitle>Most recent submission</CardTitle>
      {data ? (
        <div className=" align-middle flex flex-col justify-center items-center gap-3 h-full">
          <ProjectContainer
            name={data[0].project}
            time_string={data[0].time}
            score={data[0].score}
            users={data[0].users}
          />
          <ProjectContainer
            name={data[1].project}
            time_string={data[1].time}
            score={data[1].score}
            users={data[1].users}
          />
          <ProjectContainer
            name={data[2].project}
            time_string={data[2].time}
            score={data[2].score}
            users={data[2].users}
          />
        </div>
      ) : (
        <div className="bg-gray-500 rounded animate-pulse w-full h-full" />
      )}
    </Card>
  );
};

export default MostRecentSubmission;

import React from "react";
import axios from "axios";
import Card from "./Card";
import CardTitle from "./CardTitle";
import UserContainer from "./UserContainer";

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
  imgSize: number;
}

interface ColumnComponentProps {
  imageSrc: string;
  login: string;
  imgSize: number;
}

function ColumnComponent({ imageSrc, login, imgSize }: ColumnComponentProps) {
  return <UserContainer imgSrc={imageSrc} login={login} imgSize={imgSize} />;
}

function ProjectContainer({
  name,
  time_string,
  score,
  users,
  imgSize,
}: ProjectContainerProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="m-auto flex flex-row items-center space-x-1">
        {users.map((user, i) => (
          <ColumnComponent
            key={i}
            imageSrc={user.image}
            login={user.login}
            imgSize={imgSize}
          />
        ))}
      </div>
      <p className="text-base">{name}</p>
      <div className="text-sm 3xl:text-lg inline-flex items-center">
        <span className="text-base 2xl:text-lg 3xl:text-2xl font-semibold text-green-500">
          {score}
        </span>
        /100
        <p className="text-xs 2xl:text-sm 3xl:text-lg text-gray-400 ml-3">{time_string}</p>
      </div>
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
  const childRef = React.useRef<HTMLDivElement | null>(null);
  const [imageSize, setImageSize] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/most-recent-submission")
        .then((res) => {
          let data = res.data;
          if (JSON.stringify(data) !== "{}" && data.length > 0) setData(data);
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
    const interval = setInterval(fetchData, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  // let data = [{users: [{login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'},{login: 'bshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'},{login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}, {login: 'nfernand', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}], project: 'testproj', score: 125, time: 'now'}, {users: [{login: 'ksshamsid', image: 'https://cdn.intra.42.fr/users/15dff9281140bdfe37fd150b61936695/bshamsid.jpeg'}], project: 'testproj', score: 25, time: 'later'}, ]

  React.useEffect(() => {
    if (childRef.current) {
      const height = childRef.current.clientHeight;
      setImageSize(Math.round(height * 0.12));
    }
  }, [childRef]);

  return (
    <Card className={className + " flex flex-col"}>
      <CardTitle>Most recent submission</CardTitle>
      <div className="w-full h-full" ref={childRef}>
        {imageSize !== 0 &&
          (data ? (
            <div className="h-full flex flex-col items-center justify-around text-6xl">
              {data.map((item: any, index: number) => (
                <ProjectContainer
                  key={index}
                  name={item.project}
                  time_string={item.time}
                  score={item.score}
                  users={item.users}
                  imgSize={imageSize}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full animate-pulse rounded bg-gray-500" />
          ))}
      </div>
    </Card>
  );
};

export default MostRecentSubmission;

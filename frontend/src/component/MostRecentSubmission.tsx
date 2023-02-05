import { Card, H1Style } from "../styles";
import tw from "twin.macro";
import React from "react";

interface IMostRecentSubmissionProps {
  className?: string;
}

const tmp = {
  image:
    "https://cdn.pixabay.com/photo/2019/05/21/05/07/animal-4218265__480.jpg",
  login: "jatan",
  project: "philosopher",
};

const Container = tw.div`
    text-6xl h-full align-middle flex flex-col justify-center items-center
`;

const SubText = tw.p`
    text-lg
`;

interface User {
  image: string;
  login: string;
}
interface RecentSubmission {
  project: string;
  score: number;
  skills: string[];
  users: User[];
}

const MostRecentSubmission = ({ className }: IMostRecentSubmissionProps) => {
  const [data, setData] = React.useState<RecentSubmission | undefined>(
    undefined
  );

  React.useEffect(() => {
    const fetchData = async () => {
      await fetch("https://backend-flask.onrender.com/api/most-recent-submission")
        .then((response) => {
          if (response.ok) {
            console.log("Successfully fetch Most Recent Submission");
            return response.json();
          }
        })
        .then((data) => setData(data))
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();

    // Call the API every 5 minutes
    const interval = setInterval(fetchData, 1000 * 60 * 5);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Most recent submission</H1Style>
      {data && (
        <Container>
          <img
            src={data.users[0].image}
            width={50}
            height={50}
            alt=""
            className="rounded-full h-12 w-12 object-cover"
          />
          <p className="text-lg">{data.users[0].login}</p>
          <p className="text-lg">{data.project}</p>
        </Container>
      )}
    </Card>
  );
};

export default MostRecentSubmission;

import { Card, H1Style } from "../styles";
import tw from "twin.macro";

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

const MostRecentSubmission = ({ className }: IMostRecentSubmissionProps) => {
  const MostRecentSubmission = 4.5;
  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Most recent submission</H1Style>
      <Container>
        <img
          src={tmp.image}
          width={50}
          height={50}
          alt=""
          className="rounded-full h-12 w-12 object-cover"
        />
        <p className="text-lg">{tmp.login}</p>
        <p className="text-lg">{tmp.project}</p>
      </Container>
    </Card>
  );
};

export default MostRecentSubmission;

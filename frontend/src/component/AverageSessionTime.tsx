import { Card, H1Style } from "../styles";
import tw from "twin.macro";

interface IAverageSessionTimeProps {
  className?: string;
}

const NumberDisplay = tw.div`
    text-6xl h-full align-middle flex flex-col justify-center items-center
`;

const SubText = tw.p`
    text-lg
`;

const AverageSessionTime = ({ className }: IAverageSessionTimeProps) => {
  const averageSessionTime = 4.5;
  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Average session time</H1Style>
      <NumberDisplay>
        {averageSessionTime}hr
        <SubText>last 7 days</SubText>
      </NumberDisplay>
    </Card>
  );
};

export default AverageSessionTime;

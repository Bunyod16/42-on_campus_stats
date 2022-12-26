import { Card, H1Style } from "../styles";
import tw from "twin.macro";

interface IAverageLevelProps {
  className?: string;
}

const NumberDisplay = tw.div`
    text-6xl h-full align-middle flex justify-center items-center
`;

const AverageLevel = ({ className }: IAverageLevelProps) => {
  const averageLvl = 4.5;
  return (
    <Card className={className + " flex flex-col"}>
      <H1Style>Average level</H1Style>
      <NumberDisplay>{averageLvl}</NumberDisplay>
    </Card>
  );
};

export default AverageLevel;

import { useEffect, useState } from "react";
import TotalActiveUser7Days from "./TotalActiveUser7Days";
import WeeklyCadetXp from "./WeeklyCadetXp";

const showClass =
  "transition-opacity opacity-0 hidden duration-600 !p-0 !border-0 !mt-0";
const hiddenClass = "transition-opacity duration-500 delay-200 opacity-100";
export const ChangingCard = () => {
  const transitionTime = 20000;
  const [currentComponent, setCurrentComponent] = useState("WeeklyCadetXp");
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentComponent((currentComponent) =>
        currentComponent === "WeeklyCadetXp"
          ? "TotalActiveUser7Days"
          : "WeeklyCadetXp"
      );
    }, transitionTime);
    return () => clearInterval(intervalId);
  }, []);

  // const [className1, setClassName1] = useState(
  //   "transition-opacity duration-500 delay-300 opacity-100"
  // );
  //
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setClassName1(
  //       currentComponent === "WeeklyCadetXp"
  //         ? "transition-opacity opacity-0 hidden duration-600 !p-0 !border-0 !mt-0"
  //         : "transition-opacity duration-500 delay-200 opacity-100"
  //     );
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [currentComponent]);

  // const [className2, setClassName2] = useState(
  //   "transition-opacity opacity-0 duration-600 h-0 !p-0 !border-0 !mt-0"
  // );

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setClassName2(
  //       currentComponent === "WeeklyCadetXp"
  //         ? "transition-opacity duration-500 delay-200 opacity-100"
  //         : "transition-opacity duration-600 opacity-0 hidden !p-0 !border-0 !mt-0"
  //     );
  //   }, 1000);
  //   return () => clearTimeout(timeoutId);
  // }, [currentComponent]);
  return (
    <>
      <TotalActiveUser7Days
        className={
          currentComponent === "TotalActiveUser7Days" ? showClass : hiddenClass
        }
      />
      <WeeklyCadetXp
        className={
          currentComponent === "WeeklyCadetXp" ? showClass : hiddenClass
        }
      />
    </>
  );
};

export default ChangingCard;

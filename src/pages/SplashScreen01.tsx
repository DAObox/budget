import { FunctionComponent } from "react";
import RectangleComponent from "../components/RectangleComponent";
import LogoIcon from "../components/LogoIcon";
import WelcomeToPayup from "../components/WelcomeToPayup";

const SplashScreen01: FunctionComponent = () => {
  return (
    <div className="relative bg-white w-full h-[45.11rem] overflow-hidden text-left text-[0.78rem] font-poppins">
      <div className="absolute top-[0rem] left-[-9.39rem] w-[39.59rem] overflow-hidden flex flex-col items-center justify-end">
        <img
          className="relative w-[39.59rem] h-[45.15rem] object-cover"
          alt=""
          src="/undefined.png"
        />
        <RectangleComponent />
      </div>
      <div className="absolute top-[17.83rem] left-[4.33rem] w-[12.17rem] h-[25.5rem] overflow-hidden flex flex-col items-center justify-center gap-[14.89rem]">
        <LogoIcon />
        <WelcomeToPayup />
      </div>
    </div>
  );
};

export default SplashScreen01;

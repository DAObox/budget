import { LoadingDiv } from "@/components/framer";
import { PayupLogo } from "@/components/icons";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full pb-8">
      <LoadingDiv>
        <PayupLogo />
      </LoadingDiv>
    </div>
  );
}
